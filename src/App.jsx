import React, { useState } from 'react'
import questions from './questions.json'
import './styles.css'

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [phase, setPhase] = useState('selecting') // 'selecting' | 'pendingReveal' | 'revealed'
  const [isCorrect, setIsCorrect] = useState(null) // true | false | null
  const [gameOver, setGameOver] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)

  const current = questions[currentQuestionIndex]

  function handleOptionClick(optionIndex, e) {
    if (gameOver || quizComplete) return

    // First click: choose and lock selection, highlight orange
    if (phase === 'selecting' && selectedIndex === null) {
      // prevent this click from also triggering the global handler
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
      setSelectedIndex(optionIndex)
      setPhase('pendingReveal')
      return
    }

    // If already selected, do nothing and let event bubble to global click
  }

  function handleGlobalClick() {
    if (gameOver || quizComplete) return

    // Second click anywhere: reveal correctness
    if (phase === 'pendingReveal' && selectedIndex !== null) {
      const correct = current.correctIndex === selectedIndex
      setIsCorrect(correct)
      setPhase('revealed')
      return
    }

    // Third click: advance or game over
    if (phase === 'revealed') {
      if (isCorrect) {
        const nextIndex = currentQuestionIndex + 1
        if (nextIndex >= questions.length) {
          setQuizComplete(true)
        } else {
          setCurrentQuestionIndex(nextIndex)
        }
        setSelectedIndex(null)
        setIsCorrect(null)
        setPhase('selecting')
      } else {
        setGameOver(true)
      }
    }
  }

  function restart() {
    setCurrentQuestionIndex(0)
    setSelectedIndex(null)
    setPhase('selecting')
    setIsCorrect(null)
    setGameOver(false)
    setQuizComplete(false)
  }

  if (gameOver) {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Game Over</h1>
        </header>
        <main>
          <button className="restart-button" onClick={restart}>
            Restart
          </button>
        </main>
      </div>
    )
  }

  if (quizComplete) {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Quiz Complete!</h1>
        </header>
        <main>
          <button className="restart-button" onClick={restart}>
            Restart
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="app-container" onClick={handleGlobalClick}>
      <header className="app-header">
        <h1>
          Question #{currentQuestionIndex + 1}
        </h1>
        <p>
          {current.question}
        </p>
      </header>

      <main className="app-main">
        {current.options.map((option, idx) => {
          let buttonClass = 'quiz-button'

          // Apply different classes based on phase and selection
          if (phase === 'selecting' || phase === 'pendingReveal') {
            if (selectedIndex === idx) {
              buttonClass = 'quiz-button selected'
            }
          } else if (phase === 'revealed') {
            if (selectedIndex === idx) {
              buttonClass = isCorrect ? 'quiz-button correct' : 'quiz-button incorrect'
            }
          }

          return (
            <button
              key={idx}
              onClick={(e) => handleOptionClick(idx, e)}
              className={buttonClass}
            >
              <span className="button-prefix">{String.fromCharCode(65 + idx)}:</span> <span className="button-text">{option}</span>
            </button>
          )
        })}
      </main>
    </div>
  )
}

export default App


