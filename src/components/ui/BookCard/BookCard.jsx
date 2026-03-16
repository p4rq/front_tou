import './BookCard.css'

function BookCard({ book }) {
  // Парсим Topics и ISBN из short_description, если они там есть
  const parseDescription = (desc) => {
    if (!desc) return { topics: [], cleanDesc: '' }
    
    // Извлекаем Topics
    const topicsMatch = desc.match(/Topics?:\s*([^I]+?)(?:ISBN:|$)/i)
    const topics = topicsMatch 
      ? topicsMatch[1].split(',').map(t => t.trim()).filter(Boolean)
      : []
    
    // Удаляем Topics и ISBN из описания
    let cleanDesc = desc
      .replace(/Topics?:\s*[^I]+?(ISBN:|$)/gi, '')
      .replace(/ISBN:\s*\d+/gi, '')
      .trim()
    
    return { topics, cleanDesc }
  }
  
  const { topics, cleanDesc } = parseDescription(book.short_description)
  
  return (
    <div className="book-card">
      <div className="book-content">
        {book.thumbnailUrl && (
          <div className="book-thumbnail">
            <img 
              src={book.thumbnailUrl} 
              alt={book.title}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
        
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          
          {book.author && (
            <div className="book-author">
              {book.author}
            </div>
          )}

          {cleanDesc && (
            <p className="book-description">{cleanDesc}</p>
          )}
          
          <div className="book-meta">
            {book.year && (
              <span className="meta-year">{book.year}</span>
            )}
            {book.pageCount > 0 && (
              <span className="meta-pages">{book.pageCount} стр.</span>
            )}
            {book.isbn && (
              <span className="meta-isbn">ISBN: {book.isbn}</span>
            )}
          </div>

          {book.notables && (
            <div className="book-notables">
              <strong>Особенности:</strong> {book.notables}
            </div>
          )}
          
          {/* Отображаем Topics как теги */}
          {topics.length > 0 && (
            <div className="book-categories">
              {topics.map((topic, idx) => (
                <span key={idx} className="category-tag">{topic}</span>
              ))}
            </div>
          )}
          
          {/* Если есть categories отдельно, показываем и их */}
          {book.categories && book.categories.length > 0 && (
            <div className="book-categories">
              {book.categories.slice(0, 3).map((category, idx) => (
                <span key={idx} className="category-tag">{category}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookCard
