import React from 'react'

function QuizHeader({ questionNumber, text }) {
  return (
    <header className="app-header">
      <h1>Вопрос #{questionNumber}</h1>
      <p>{text}</p>
    </header>
  )
}

export default QuizHeader


