# 📁 Структура Frontend проекта

## Обзор

Проект организован по принципу **Feature-Driven Development** с четким разделением на UI компоненты, функциональные модули, утилиты и хуки.

## 🗂️ Структура папок

```
client/src/
├── App.jsx                 # Главный компонент приложения
├── App.css                 # Стили главного компонента
├── main.jsx                # Точка входа React
├── index.css               # Глобальные стили
│
├── components/             # Переиспользуемые компоненты
│   ├── ui/                 # UI компоненты общего назначения
│   │   ├── BookCard/       # Карточка книги
│   │   ├── BookList/       # Список книг
│   │   └── FeedbackButtons/# Кнопки Успех/Провал
│   │
│   └── search/             # Компоненты поиска
│       ├── SearchBar/      # Традиционный поиск с фильтрами
│       ├── AISearch/       # AI-поиск
│       └── SearchHistory/  # История поисковых запросов
│
├── features/               # Фичи (логически связанные компоненты)
│   ├── statistics/         # Модуль статистики
│   │   ├── Statistics.jsx           # Общая статистика
│   │   ├── SearchStatistics.jsx     # Статистика manual поиска
│   │   └── AISearchStatistics.jsx   # Статистика AI поиска
│   │
│   └── query-log/          # Модуль логирования запросов
│       └── QueryLog.jsx    # Компонент отображения запросов
│
├── hooks/                  # Кастомные React хуки
│   ├── useStatistics.js          # Управление статистикой
│   ├── useSearch.js              # Управление поиском
│   └── useSessionTracking.js     # Управление сессией
│
├── utils/                  # Утилиты и вспомогательные функции
│   ├── sessionId.js              # Генерация UUID сессий
│   ├── statistics.js             # Логика статистики
│   └── api.js                    # API запросы (fetch wrappers)
│
└── constants/              # Константы приложения
    └── api.js              # API endpoints и ключи localStorage
```

## 📦 Модули

### Components / UI

**Назначение:** Переиспользуемые UI компоненты без бизнес-логики

- `BookCard` - Карточка книги с информацией
- `BookList` - Список карточек книг
- `FeedbackButtons` - Кнопки для отметки успеха/провала поиска

### Components / Search

**Назначение:** Компоненты поиска

- `SearchBar` - Традиционный поиск с фильтрами (title, author, keywords,...)
- `AISearch` - AI-поиск с естественным языком и диалогом
- `SearchHistory` - История последних поисковых запросов

### Features / Statistics

**Назначение:** Модуль сбора и отображения статистики

- `Statistics` - Общая статистика результатов поиска
- `SearchStatistics` - Детальная статистика manual режима (клики, символы, время)
- `AISearchStatistics` - Детальная статистика AI режима (API calls, диалог)

### Features / Query Log

**Назначение:** Отображение информации о выполненных запросах

- `QueryLog` - Показывает параметры последнего запроса и debug информацию

## 🪝 Хуки

### useStatistics(mode)

**Параметры:**
- `mode` - 'manual' | 'ai'

**Возвращает:**
```javascript
{
  stats,                    // Текущие метрики
  trackClick,               // Трекинг кликов
  trackCharacters,          // Трекинг символов
  trackSearch,              // Трекинг поисков
  trackFailedAttempt,       // Трекинг провалов
  trackAIMessage,           // Трекинг AI сообщений
  trackAIApiCall,           // Трекинг API вызовов
  trackAISearchAttempt,     // Трекинг попыток AI поиска
  updateFiltersCount,       // Обновление счетчика фильтров
  reset                     // Сброс статистики
}
```

### useSearch()

**Возвращает:**
```javascript
{
  allBooks,                 // Все найденные книги
  loading,                  // Состояние загрузки
  error,                    // Ошибка
  searchPerformed,          // Флаг выполненного поиска
  aiCost,                   // Стоимость AI запроса
  performManualSearch,      // Выполнить manual поиск
  performAISearch,          // Выполнить AI поиск
  clearResults              // Очистить результаты
}
```

### useSessionTracking()

**Возвращает:**
```javascript
{
  sessionId,                // UUID сессии
  sessionStartTime,         // Timestamp начала
  searchSessionHistory,     // История запросов
  awaitingFeedback,         // Ожидание feedback от пользователя
  setAwaitingFeedback,      // Установить флаг
  addToHistory,             // Добавить в историю
  saveStatistics,           // Сохранить статистику
  resetSession              // Сбросить сессию
}
```

## 🛠️ Утилиты

### utils/sessionId.js

- `generateSessionId()` - Генерирует UUID v4 для идентификации сессии

### utils/api.js

- `manualSearch(filters)` - Выполняет POST /api/manual
- `aiSearch(message)` - Выполняет GET /api/aiquery
- `saveStatistics(data)` - Сохраняет статистику (POST /api/statistics или localStorage)
- `getOfflineStatistics()` - Получает offline статистику
- `clearOfflineStatistics()` - Очищает offline статистику

### utils/statistics.js

- `prepareStatisticsData(params)` - Формирует объект для отправки на сервер
- `INITIAL_MANUAL_STATS` - Начальное состояние для manual режима
- `INITIAL_AI_STATS` - Начальное состояние для AI режима
- `checkNeedsMoreData(data)` - Проверяет нужны ли AI больше данных

### constants/api.js

```javascript
API_BASE = '/api'
API_ENDPOINTS = {
  MANUAL_SEARCH: '/api/manual',
  AI_SEARCH: '/api/aiquery',
  STATISTICS: '/api/statistics'
}
STORAGE_KEYS = {
  SEARCH_HISTORY: 'searchHistory',
  OFFLINE_STATISTICS: 'offlineStatistics'
}
```

## 🎯 Принципы организации

### 1. Single Responsibility
Каждый компонент/утилита отвечает за одну задачу

### 2. Co-location
CSS файлы находятся рядом с компонентами

### 3. Feature-Driven
Логически связанные компоненты группируются в features

### 4. Separation of Concerns
- **Components** - только UI
- **Hooks** - бизнес-логика и состояние
- **Utils** - вспомогательные функции
- **Constants** - конфигурация

### 5. Reusability
- UI компоненты независимы и переиспользуемы
- Хуки инкапсулируют общую логику
- Утилиты чистые функции

## 📝 Примеры использования

### Использование хука статистики

```javascript
import { useStatistics } from './hooks/useStatistics'

function MyComponent() {
  const { 
    stats, 
    trackClick, 
    trackCharacters 
  } = useStatistics('manual')

  return (
    <button onClick={trackClick}>
      Clicks: {stats.clicks}
    </button>
  )
}
```

### Выполнение поиска

```javascript
import { useSearch } from './hooks/useSearch'

function SearchComponent() {
  const { 
    allBooks, 
    loading, 
    performManualSearch 
  } = useSearch()

  const handleSearch = async () => {
    const filters = { title: 'Python', topK: 3 }
    await performManualSearch(filters)
  }

  return loading ? <Spinner /> : <BookList books={allBooks} />
}
```

## 🔄 Миграция

Проект был реорганизован из плоской структуры:
```
components/
  ├── BookCard.jsx
  ├── SearchBar.jsx
  ├── Statistics.jsx
  └── ... (12 компонентов)
```

В модульную структуру с разделением по назначению и переиспользуемости.

## ✅ Преимущества новой структуры

1. **Масштабируемость** - легко добавлять новые фичи
2. **Поддержка** - быстрый поиск нужного кода
3. **Тестируемость** - изолированные модули
4. **Переиспользование** - UI компоненты независимы
5. **Понятность** - четкая иерархия и назначение

## 📚 Дополнительно

- Все компоненты используют функциональный стиль
- Хуки используют `useCallback` для оптимизации
- API утилиты обрабатывают offline режим
- Статистика сохраняется в localStorage при недоступности сервера
