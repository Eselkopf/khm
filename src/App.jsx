import React, { useState } from 'react'
import questions from './questions.json'

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
      <div
        className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100"
        onClick={() => {}}
      >
        <div className="w-full max-w-xl mx-auto p-6 text-center space-y-6">
          <h1 className="text-3xl font-bold">Game Over</h1>
          <button
            onClick={restart}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Restart
          </button>
        </div>
      </div>
    )
  }

  if (quizComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100"
        onClick={() => {}}
      >
        <div className="w-full max-w-xl mx-auto p-6 text-center space-y-6">
          <h1 className="text-3xl font-bold">Quiz Complete!</h1>
          <button
            onClick={restart}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Restart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100"
      onClick={handleGlobalClick}
    >
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</div>
          <h1 className="text-2xl md:text-3xl font-semibold leading-snug">
            {current.question}
          </h1>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {current.options.map((option, idx) => {
              let color = 'bg-gray-800 hover:bg-gray-700'

              if (phase === 'selecting' || phase === 'pendingReveal') {
                if (selectedIndex === idx) {
                  color = 'bg-orange-600 hover:bg-orange-600'
                }
              } else if (phase === 'revealed') {
                if (selectedIndex === idx) {
                  color = isCorrect ? 'bg-green-600' : 'bg-red-600'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={(e) => handleOptionClick(idx, e)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ring-1 ring-white/10 ${color}`}
                  aria-pressed={selectedIndex === idx}
                >
                  <span className="font-medium">{String.fromCharCode(65 + idx)}.</span>{' '}
                  {option}
                </button>
              )
            })}
          </div>

          <div className="text-sm text-gray-400 pt-2">
            {phase === 'selecting' && 'Click an option to select.'}
            {phase === 'pendingReveal' && 'Click anywhere to reveal the answer.'}
            {phase === 'revealed' && (isCorrect ? 'Correct! Click to continue.' : 'Incorrect. Click to end the game.')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App


