import { useState, useEffect } from 'react'
import './SearchStatistics.css'

function SearchStatistics({ stats, startTime }) {
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

  const activeFilters = stats.filters || 0
  const totalClicks = stats.clicks || 0
  const totalChars = stats.characters || 0
  const searchAttempts = stats.searches || 0
  const failedAttempts = stats.failedAttempts || 0

  return (
    <div className="search-statistics">
      <div className="stats-header">
        <h3>Статистика поиска</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{activeFilters}</div>
          <div className="stat-label">Активных фильтров</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{totalClicks}</div>
          <div className="stat-label">Кликов</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{totalChars}</div>
          <div className="stat-label">Введено символов</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{searchAttempts}</div>
          <div className="stat-label">Попыток поиска</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{failedAttempts}</div>
          <div className="stat-label">Провальных попыток</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-value">{formatTime(elapsedTime)}</div>
          <div className="stat-label">Время сессии</div>
        </div>
      </div>

      <button 
        className="reset-stats-btn"
        onClick={() => window.location.reload()}
        title="Сбросить статистику и начать новую сессию"
      >
        Сбросить статистику
      </button>
    </div>
  )
}

export default SearchStatistics
