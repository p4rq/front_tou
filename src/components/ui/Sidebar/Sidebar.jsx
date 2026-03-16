import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ filters, onFilterChange, onReset, disabled }) {
  const [expandedSections, setExpandedSections] = useState({
    resourceType: false,
    publicationDate: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleFilterChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const hasActiveFilters = 
    filters.author || filters.shortDesc || filters.notables ||
    filters.yearFrom || filters.yearTo || filters.keywords

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Уточнить поиск</h2>
        {hasActiveFilters && (
          <button 
            className="reset-filters-btn"
            onClick={onReset}
            disabled={disabled}
          >
            Очистить
          </button>
        )}
      </div>

      <div className="sidebar-content">
        {/* Resource Type */}
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('resourceType')}
          >
            <span>Тип ресурса</span>
            <span className="toggle-icon">{expandedSections.resourceType ? '∧' : '∨'}</span>
          </button>
          {expandedSections.resourceType && (
            <div className="filter-section-content">
              <label className="filter-label">Автор</label>
              <input
                type="text"
                placeholder="Поиск по автору..."
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                disabled={disabled}
                className="filter-input"
              />

              <label className="filter-label">Описание</label>
              <input
                type="text"
                placeholder="Поиск в описании..."
                value={filters.shortDesc}
                onChange={(e) => handleFilterChange('shortDesc', e.target.value)}
                disabled={disabled}
                className="filter-input"
              />

              <label className="filter-label">Ключевые слова</label>
              <input
                type="text"
                placeholder="Через запятую..."
                value={filters.keywords}
                onChange={(e) => handleFilterChange('keywords', e.target.value)}
                disabled={disabled}
                className="filter-input"
              />

              <label className="filter-label">Категория</label>
              <input
                type="text"
                placeholder="Напр: Java, Android, Internet..."
                value={filters.notables}
                onChange={(e) => handleFilterChange('notables', e.target.value)}
                disabled={disabled}
                className="filter-input"
              />
            </div>
          )}
        </div>

        {/* Publication Date */}
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('publicationDate')}
          >
            <span>Дата публикации</span>
            <span className="toggle-icon">{expandedSections.publicationDate ? '∧' : '∨'}</span>
          </button>
          {expandedSections.publicationDate && (
            <div className="filter-section-content">
              <div className="date-range">
                <div className="date-input-group">
                  <label className="filter-label">От</label>
                  <input
                    type="number"
                    placeholder="1900"
                    min="1900"
                    max="2100"
                    value={filters.yearFrom}
                    onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                    disabled={disabled}
                    className="filter-input"
                  />
                </div>
                <div className="date-input-group">
                  <label className="filter-label">До</label>
                  <input
                    type="number"
                    placeholder="2026"
                    min="1900"
                    max="2100"
                    value={filters.yearTo}
                    onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                    disabled={disabled}
                    className="filter-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
