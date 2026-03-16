import { useState, useEffect } from 'react'
import SearchBar from './components/search/SearchBar/SearchBar'
import BookList from './components/ui/BookList/BookList'
import AISearch from './components/search/AISearch/AISearch'
import SearchStatistics from './features/statistics/SearchStatistics'
import AISearchStatistics from './features/statistics/AISearchStatistics'
import FeedbackButtons from './components/ui/FeedbackButtons/FeedbackButtons'
import Sidebar from './components/ui/Sidebar/Sidebar'
import './App.css'

function App() {
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [searchMode, setSearchMode] = useState('manual')
  
  // Генерация UUID для sessionId
  const generateSessionId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
  
  // Состояние сессии и feedback
  const [sessionId, setSessionId] = useState(() => generateSessionId())
  const [awaitingFeedback, setAwaitingFeedback] = useState(false)
  const [searchSessionHistory, setSearchSessionHistory] = useState([])
  
  // Статистика для традиционного поиска
  const [searchStats, setSearchStats] = useState({
    clicks: 0,
    characters: 0,
    searches: 0,
    filters: 0,
    failedAttempts: 0
  })
  const [sessionStartTime, setSessionStartTime] = useState(Date.now())
  
  // Статистика для AI-поиска
  const [aiStats, setAiStats] = useState({
    characters: 0,
    apiCalls: 0,
    searchAttempts: 0,
    needMoreDataCount: 0
  })
  const [aiSessionStartTime, setAiSessionStartTime] = useState(Date.now())
  
  // Фильтры и настройки для нового API
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    shortDesc: '',
    notables: '',
    yearFrom: '',
    yearTo: '',
    keywords: '',
    topK: 3
  })
  
  const handleSearch = async () => {
    trackSearch()
    setLoading(true)
    setError(null)
    setSearchPerformed(true)
    
    try {
      // Подготовка параметров для нового API
      const requestBody = {
        title: filters.title || null,
        author: filters.author || null,
        shortDesc: filters.shortDesc || null,
        notables: filters.notables || null,
        minSimilarity: 0.3,
        yearFrom: filters.yearFrom ? parseInt(filters.yearFrom) : 0,
        yearTo: filters.yearTo ? parseInt(filters.yearTo) : 9999,
        keywords: filters.keywords ? filters.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
        topK: parseInt(filters.topK) || 3
      }

      const response = await fetch('/api/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setAllBooks(data)
      
      // Добавляем в историю текущей сессии
      const sessionHistoryItem = {
        timestamp: new Date().toISOString(),
        query: requestBody,
        resultsCount: data.length,
        attemptNumber: searchSessionHistory.length + 1
      }
      setSearchSessionHistory(prev => [...prev, sessionHistoryItem])
      
      // Если есть результаты, ждем feedback
      if (data.length > 0 && searchMode === 'manual') {
        setAwaitingFeedback(true)
      }
      
    } catch (err) {
      setError(err.message)
      setAllBooks([])
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      title: '',
      author: '',
      shortDesc: '',
      notables: '',
      yearFrom: '',
      yearTo: '',
      keywords: '',
      topK: 3
    })
  }

  const handleAIResult = (books) => {
    setAllBooks(books)
    setSearchPerformed(true)
    
    // Если есть результаты, ждем feedback
    if (books.length > 0 && searchMode === 'ai') {
      setAwaitingFeedback(true)
    }
  }

  // Функции для отслеживания AI статистики
  const trackAICharacters = (count) => {
    if (searchMode === 'ai') {
      setAiStats(prev => ({ ...prev, characters: prev.characters + count }))
    }
  }

  const trackAIApiCall = () => {
    if (searchMode === 'ai') {
      setAiStats(prev => ({ ...prev, apiCalls: prev.apiCalls + 1 }))
    }
  }

  const trackAISearchAttempt = (needsMoreData) => {
    if (searchMode === 'ai') {
      setAiStats(prev => ({
        ...prev,
        searchAttempts: prev.searchAttempts + 1,
        needMoreDataCount: needsMoreData ? prev.needMoreDataCount + 1 : prev.needMoreDataCount
      }))
    }
  }

  // Функции для отслеживания статистики
  const trackClick = () => {
    if (searchMode === 'manual') {
      setSearchStats(prev => ({ ...prev, clicks: prev.clicks + 1 }))
    }
  }

  const trackCharacters = (count) => {
    if (searchMode === 'manual') {
      setSearchStats(prev => ({ ...prev, characters: prev.characters + count }))
    }
  }

  const trackSearch = () => {
    if (searchMode === 'manual') {
      setSearchStats(prev => ({ ...prev, searches: prev.searches + 1 }))
    }
  }

  // Функция для сохранения статистики на сервер

  const saveStatistics = async (success) => {
    const isAIMode = searchMode === 'ai'
    const startTime = isAIMode ? aiSessionStartTime : sessionStartTime
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000)
    
    const statisticsData = isAIMode ? {
      sessionId: sessionId,
      searchMode: 'ai',
      totalCharacters: aiStats.characters,
      apiCalls: aiStats.apiCalls,
      searchAttempts: aiStats.searchAttempts,
      needMoreDataCount: aiStats.needMoreDataCount,
      timeSpentSeconds: timeSpentSeconds,
      success: success,
      searchHistory: searchSessionHistory,
      finalQuery: searchSessionHistory.length > 0 ? searchSessionHistory[searchSessionHistory.length - 1].query : null
    } : {
      sessionId: sessionId,
      searchMode: 'manual',
      totalClicks: searchStats.clicks,
      totalCharacters: searchStats.characters,
      totalSearches: searchStats.searches,
      failedAttempts: searchStats.failedAttempts,
      activeFiltersCount: searchStats.filters,
      timeSpentSeconds: timeSpentSeconds,
      success: success,
      searchHistory: searchSessionHistory,
      finalQuery: searchSessionHistory.length > 0 ? searchSessionHistory[searchSessionHistory.length - 1].query : null
    }

    try {
      // Попытка отправить на сервер
      const response = await fetch('/api/statistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statisticsData)
      })

      if (response.ok) {
        console.log('Statistics saved to server')
      } else {
        // Если сервер не отвечает, сохраняем локально
        console.warn('Server unavailable, saving to localStorage')
        const localStats = JSON.parse(localStorage.getItem('offlineStatistics') || '[]')
        localStats.push(statisticsData)
        localStorage.setItem('offlineStatistics', JSON.stringify(localStats))
      }
    } catch (error) {
      // Если ошибка подключения, сохраняем локально
      console.warn('Error saving statistics, storing locally:', error)
      const localStats = JSON.parse(localStorage.getItem('offlineStatistics') || '[]')
      localStats.push(statisticsData)
      localStorage.setItem('offlineStatistics', JSON.stringify(localStats))
    }
  }

  // Обработка успешного нахождения книги
  const handleSuccess = async () => {
    await saveStatistics(true)
    
    // Сброс сессии
    setSessionId(generateSessionId())
    setSessionStartTime(Date.now())
    setAiSessionStartTime(Date.now())
    setSearchStats({
      clicks: 0,
      characters: 0,
      searches: 0,
      filters: 0,
      failedAttempts: 0
    })
    setAiStats({
      characters: 0,
      apiCalls: 0,
      searchAttempts: 0,
      needMoreDataCount: 0
    })
    setSearchSessionHistory([])
    setAwaitingFeedback(false)
    
    // Очистка результатов
    setAllBooks([])
    setSearchPerformed(false)
    
    // Показать уведомление
    alert('Спасибо! Статистика сохранена. Начните новый поиск.')
  }

  // Обработка провала (пользователь не нашел нужную книгу)
  const handleFailure = () => {
    if (searchMode === 'manual') {
      // Увеличиваем счетчик провалов
      setSearchStats(prev => ({ ...prev, failedAttempts: prev.failedAttempts + 1 }))
    }
    
    // Разблокируем UI для продолжения поиска
    setAwaitingFeedback(false)
    
    console.log('Failed attempt recorded, you can continue searching')
  }

  // Отслеживаем количество активных фильтров
  useEffect(() => {
    if (searchMode === 'manual') {
      let activeFilters = 0
      if (filters.title) activeFilters++
      if (filters.author) activeFilters++
      if (filters.shortDesc) activeFilters++
      if (filters.yearFrom || filters.yearTo) activeFilters++
      if (filters.keywords) activeFilters++
      
      setSearchStats(prev => ({ ...prev, filters: activeFilters }))
    }
  }, [filters, searchMode])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Digital Library System</h1>
          <p className="tagline">Профессиональный поиск технической литературы</p>
        </div>
      </header>

      <main className="app-main">
        <div className="main-container">
          {searchMode === 'manual' && (
            <Sidebar 
              filters={filters}
              onFilterChange={setFilters}
              onReset={resetFilters}
              disabled={awaitingFeedback}
            />
          )}
          
          <div className="content-area">
            <div className="search-section">
              <div className="search-mode-toggle">
                <button 
                  className={`mode-btn ${searchMode === 'manual' ? 'active' : ''}`}
                  onClick={() => {
                    if (awaitingFeedback) {
                      alert('Сначала отправьте статистику по текущему поиску!');
                      return;
                    }
                    setSearchMode('manual');
                  }}
                >
                  <span className="mode-label">Классический поиск</span>
                  <span className="mode-description">Поиск по названию, автору, описанию</span>
                </button>
                <button 
                  className={`mode-btn mode-btn-ai ${searchMode === 'ai' ? 'active' : ''}`}
                  onClick={() => {
                    if (awaitingFeedback) {
                      alert('Сначала отправьте статистику по текущему поиску!');
                      return;
                    }
                    setSearchMode('ai');
                  }}
                >
                  <span className="mode-label">AI-ассистент</span>
                  <span className="mode-description">Интеллектуальный диалоговый поиск</span>
                </button>
              </div>

              {searchMode === 'manual' ? (
                <>
                  <SearchBar 
                    onSearch={handleSearch} 
                    loading={loading}
                    filters={filters}
                    onFilterChange={setFilters}
                    onTextChange={trackCharacters}
                    onClick={trackClick}
                    disabled={awaitingFeedback}
                  />
                  {awaitingFeedback && (
                    <div className="awaiting-feedback-notice">
                      <span>Поиск приостановлен. Отметьте результат ниже.</span>
                    </div>
                  )}
                </>
              ) : (
                <AISearch 
                  onResult={handleAIResult}
                  loading={loading}
                  disabled={awaitingFeedback}
                  onCharacters={trackAICharacters}
                  onApiCall={trackAIApiCall}
                  onSearchAttempt={trackAISearchAttempt}
                />
              )}
              
            </div>
            
            {error && (
              <div className="error-message">
                <strong>Ошибка:</strong> {error}
              </div>
            )}

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Поиск книг в базе данных...</p>
              </div>
            )}

            {!loading && searchPerformed && (
              <div className="results-container">
                <div className="results-content">
                  <div className="results-header">
                    <div className="results-count">
                      <span className="count-bold">{allBooks.length}</span> результатов
                    </div>
                    <div className="results-badge">
                      топ-{allBooks.length} релевантных
                    </div>
                  </div>

                  <BookList books={allBooks} />

                  {awaitingFeedback && (
                    <FeedbackButtons 
                      onSuccess={handleSuccess}
                      onFailure={handleFailure}
                      disabled={loading}
                    />
                  )}

                  {searchMode === 'manual' && (
                    <SearchStatistics 
                      stats={searchStats}
                      startTime={sessionStartTime}
                    />
                  )}

                  {searchMode === 'ai' && (
                    <AISearchStatistics 
                      stats={aiStats}
                      startTime={aiSessionStartTime}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2026 Digital Library System</p>
          <p className="footer-tech">PostgreSQL • Similarity Search • AI Assistant</p>
        </div>
      </footer>
    </div>
  )
}

export default App
