import React from 'react'

function QuizCompletedScreen({ onRestart }) {
  return (
    <div className="app-container" onClick={onRestart}>
      <main className="app-main" style={{ cursor: 'pointer', textAlign: 'center' }}>
        <h1>Quiz Completed</h1>
      </main>
    </div>
  )
}

export default QuizCompletedScreen


