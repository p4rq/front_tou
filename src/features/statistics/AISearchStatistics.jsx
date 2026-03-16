import { useState, useEffect } from 'react'
import './AISearchStatistics.css'

function AISearchStatistics({ stats, startTime }) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!startTime) return

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(elapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const characters = stats.characters || 0
  const apiCalls = stats.apiCalls || 0
  const searchAttempts = stats.searchAttempts || 0
  const messagesCount = stats.messagesCount || 0
  const needMoreDataCount = stats.needMoreDataCount || 0

  return (
    <div className="ai-search-statistics">
      <div className="stats-header">
        <h3>Статистика AI-поиска</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{characters}</div>
          <div className="stat-label">Введено символов</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{apiCalls}</div>
          <div className="stat-label">Обращений к AI</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{searchAttempts}</div>
          <div className="stat-label">Попыток поиска</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{messagesCount}</div>
          <div className="stat-label">Сообщений в диалоге</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-value">{needMoreDataCount}</div>
          <div className="stat-label">"Нужно больше данных"</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-value">{formatTime(elapsedTime)}</div>
          <div className="stat-label">Время сессии</div>
        </div>
      </div>

      <div className="stats-info">
        <p className="info-text">
          <strong>Подсказка:</strong> AI просит больше данных {needMoreDataCount} раз из {searchAttempts} попыток 
          ({searchAttempts > 0 ? Math.round((needMoreDataCount / searchAttempts) * 100) : 0}% запросов).
        </p>
      </div>
    </div>
  )
}

export default AISearchStatistics
