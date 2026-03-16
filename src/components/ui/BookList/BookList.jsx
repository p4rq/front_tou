import BookCard from '../BookCard/BookCard'
import './BookList.css'

function BookList({ books }) {
  if (books.length === 0) {
    return (
      <div className="no-results">
        <p>Книги не найдены</p>
        <p className="hint">Попробуйте изменить запрос или уменьшить количество слов</p>
      </div>
    )
  }

  return (
    <div className="book-list">
      <div className="books-grid">
        {books.map((book, index) => (
          <BookCard key={book._id || index} book={book} />
        ))}
      </div>
    </div>
  )
}

export default BookList
