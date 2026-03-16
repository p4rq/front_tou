# Book Search Client - React Frontend

React клиент для поиска книг через API на C#.

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение откроется на `http://localhost:3000`

### Сборка для продакшена

```bash
npm run build
```

Результат будет в папке `dist/`

## 📋 Требования

- Node.js 18+ 
- npm 9+
- **Запущенный ASPServer на порту 5005**

## 🔧 Конфигурация

Прокси настроен в `vite.config.js`:
- API запросы с `/api/*` перенаправляются на `http://localhost:5005`

## 📁 Структура проекта

```
client/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       # Компонент поиска
│   │   ├── SearchBar.css
│   │   ├── BookList.jsx        # Список результатов
│   │   ├── BookList.css
│   │   ├── BookCard.jsx        # Карточка книги
│   │   └── BookCard.css
│   ├── App.jsx                 # Главный компонент
│   ├── App.css
│   ├── main.jsx                # Точка входа
│   └── index.css               # Глобальные стили
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Функциональность

- ✅ Поиск книг через API
- ✅ Настройка количества результатов (5-100)
- ✅ Отображение карточек с обложками
- ✅ Адаптивный дизайн
- ✅ Индикатор загрузки
- ✅ Обработка ошибок

## 🔌 API Endpoint

```
POST http://localhost:5005/api/manual
Content-Type: application/json

{
  "title": "запрос поиска",
  "topK": 10
}
```

## 🎯 Использование

1. Убедитесь что ASPServer запущен
2. Запустите React клиент: `npm run dev`
3. Откройте браузер на `http://localhost:3000`
4. Введите запрос и нажмите "Искать"

## 🛠️ Технологии

- **React 18** - UI библиотека
- **Vite** - сборщик и dev сервер
- **CSS** - стилизация (без дополнительных библиотек)
- **Fetch API** - HTTP запросы
