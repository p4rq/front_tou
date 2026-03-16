import { useState } from 'react'
import './FeedbackButtons.css'

function FeedbackButtons({ onSuccess, onFailure, disabled }) {
  const [confirming, setConfirming] = useState(null) // 'success' | 'failure' | null

  const handleSuccess = () => {
    if (confirming === 'success') {
      onSuccess()
      setConfirming(null)
    } else {
      setConfirming('success')
      setTimeout(() => setConfirming(null), 3000)
    }
  }

  const handleFailure = () => {
    if (confirming === 'failure') {
      onFailure()
      setConfirming(null)
    } else {
      setConfirming('failure')
      setTimeout(() => setConfirming(null), 3000)
    }
  }

  return (
    <div className="feedback-buttons">
      <div className="feedback-header">
        <h3>Нашли нужную книгу?</h3>
        <p>Помогите нам улучшить поиск, отметив результат</p>
      </div>
      
      <div className="feedback-actions">
        <button 
          className={`feedback-btn success ${confirming === 'success' ? 'confirming' : ''}`}
          onClick={handleSuccess}
          disabled={disabled}
        >
          <span className="feedback-text">
            {confirming === 'success' ? 'Подтвердить успех' : 'Успех'}
          </span>
        </button>
        
        <button 
          className={`feedback-btn failure ${confirming === 'failure' ? 'confirming' : ''}`}
          onClick={handleFailure}
          disabled={disabled}
        >
          <span className="feedback-text">
            {confirming === 'failure' ? 'Подтвердить провал' : 'Провал'}
          </span>
        </button>
      </div>

      {confirming && (
        <p className="feedback-hint">
          {confirming === 'success' 
            ? 'Нажмите еще раз для подтверждения. Статистика будет сохранена и сессия сброшена.'
            : 'Нажмите еще раз для подтверждения. Вы сможете продолжить поиск.'}
        </p>
      )}
    </div>
  )
}

export default FeedbackButtons
