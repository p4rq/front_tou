import { useState } from 'react'
import './AISearch.css'

function AISearch({ onResult, loading, disabled, onCharacters, onApiCall, onSearchAttempt }) {
  const [message, setMessage] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [error, setError] = useState(null)
  const [conversation, setConversation] = useState([]) // История диалога

  const handleMessageChange = (e) => {
    const newValue = e.target.value
    const diff = newValue.length - message.length
    if (diff > 0 && onCharacters) {
      onCharacters(diff)
    }
    setMessage(newValue)
  }

  const handleAISearch = async (e) => {
    e.preventDefault()
    
    if (message.trim().length < 20) {
      setError('Минимальная длина запроса для AI — 20 символов')
      return
    }

    setAiLoading(true)
    setError(null)
    setAiResult(null)
    
    // Добавляем сообщение пользователя в историю
    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() }
    setConversation(prev => [...prev, userMessage])
    
    try {
      // Трекаем API вызов
      if (onApiCall) onApiCall()
      
      const response = await fetch(`/api/aiquery?message=${encodeURIComponent(message)}`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setAiResult(data)
      
      // Добавляем ответ AI в историю
      const aiMessage = { role: 'ai', content: data.ai_message, timestamp: new Date().toISOString() }
      setConversation(prev => [...prev, aiMessage])
      
      // Проверяем, просит ли AI больше данных
      const needsMoreData = !data.book_json || data.ai_message?.toLowerCase().includes('больше информации') || 
                            data.ai_message?.toLowerCase().includes('уточните') ||
                            data.ai_message?.toLowerCase().includes('не могу найти')
      
      // Трекаем попытку поиска
      if (onSearchAttempt) onSearchAttempt(needsMoreData)
      
      // Если найдена книга, парсим JSON и передаем родителю
      if (data.book_json) {
        try {
          const book = JSON.parse(data.book_json)
          onResult([book], data.ai_message, data.cost)
        } catch (e) {
          setError('Ошибка парсинга результата: ' + e.message)
        }
      } else {
        onResult([], data.ai_message, data.cost)
      }
      
      // Очищаем поле ввода только если AI нашёл книгу
      if (data.book_json) {
        setMessage('')
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="ai-search">
      <div className="ai-header">
        <h3>AI-поиск (экспериментальный)</h3>
      </div>
      
      {conversation.length > 0 && (
        <div className="ai-conversation">
          <div className="conversation-header">
            <span>Диалог ({conversation.length} сообщений)</span>
          </div>
          <div className="conversation-messages">
            {conversation.map((msg, idx) => (
              <div key={idx} className={`conversation-message ${msg.role}`}>
                <div className="message-role">
                  {msg.role === 'user' ? 'Вы' : 'AI'}
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleAISearch} className="ai-form">
        <div className="ai-input-group">
          <textarea
            className="ai-textarea"
            placeholder="Опишите, какую книгу вы ищете (минимум 20 символов)... Например: 'Мне нужна книга про основы программирования на Python для начинающих'"
            value={message}
            onChange={handleMessageChange}
            disabled={loading || aiLoading || disabled}
            rows={3}
          />
          <div className="ai-controls">
            <span className="char-count">{message.length} / 20 символов</span>
            <button 
              type="submit" 
              className="ai-search-button"
              disabled={loading || aiLoading || disabled || message.trim().length < 20}
            >
              {aiLoading ? 'Поиск AI...' : 'Искать с AI'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="ai-error">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {aiResult && (
        <div className="ai-result">
          <div className="ai-message">{aiResult.ai_message}</div>
          {aiResult.cost && (
            <div className="ai-cost">
              Стоимость запроса: ${aiResult.cost.toFixed(6)}
            </div>
          )}
        </div>
      )}
      
      {disabled && (
        <div className="ai-awaiting-feedback">
          <span>Поиск приостановлен. Отметьте результат ниже.</span>
        </div>
      )}
    </div>
  )
}

export default AISearch
