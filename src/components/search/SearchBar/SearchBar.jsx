import './SearchBar.css'

function SearchBar({ onSearch, loading, filters, onFilterChange, onTextChange, onClick, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!disabled && filters.title.trim()) {
      onSearch()
    }
  }

  const quickSearches = [
    'Android', 'JavaScript', 'Python', 'Java', 'React', 
    'Machine Learning', 'Database', 'Web Development'
  ]

  const handleFilterChange = (field, value) => {
    // Отслеживаем количество символов
    if (field === 'title' && onTextChange) {
      const diff = value.length - (filters[field]?.length || 0)
      if (diff > 0) {
        onTextChange(diff)
      }
    }
    onFilterChange({ ...filters, [field]: value })
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Название книги... (минимум 4-5 символов для точного поиска)"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            disabled={loading || disabled}
            autoFocus
          />
          {filters.title && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => handleFilterChange('title', '')}
              disabled={loading || disabled}
            >
              ×
            </button>
          )}
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || disabled || !filters.title.trim()}
            onClick={() => onClick && onClick()}
          >
            {loading ? 'Поиск...' : 'Искать'}
          </button>
        </div>
        
        <div className="quick-searches">
          <span className="quick-label">Популярное:</span>
          {quickSearches.map((term, idx) => (
            <button
              key={idx}
              type="button"
              className="quick-search-btn"
              onClick={() => {
                if (onClick) onClick()
                handleFilterChange('title', term)
                setTimeout(() => onSearch(), 0)
              }}
              disabled={loading || disabled}
            >
              {term}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}

export default SearchBar
