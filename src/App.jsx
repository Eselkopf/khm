import React, { useRef, useState } from 'react'
import './styles.css'

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [phase, setPhase] = useState('newGame') // 'newGame' | 'selecting' | 'pendingReveal' | 'revealed'
  const [isCorrect, setIsCorrect] = useState(null) // true | false | null
  const [questionsList, setQuestionsList] = useState(null)
  const fileInputRef = useRef(null)

  function loadQuestionsFromFile(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function(e) {
        try {
          const loadedQuestions = JSON.parse(e.target.result)
          if (Array.isArray(loadedQuestions) && loadedQuestions.length > 0) {
            setQuestionsList(loadedQuestions)
            setCurrentQuestionIndex(0)
            setSelectedIndex(null)
            setPhase('selecting')
            setIsCorrect(null)
            alert(`Successfully loaded ${loadedQuestions.length} questions!`)
          } else {
            alert('Invalid questions format. Please ensure the JSON contains an array of questions.')
          }
        } catch (error) {
          alert('Error parsing JSON file. Please check the file format.')
          console.error('JSON parsing error:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  function handleOptionClick(optionIndex, e) {
    if (!questionsList || phase !== 'selecting') return

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
    if (!questionsList) return

    // Second click anywhere: reveal correctness
    if (phase === 'pendingReveal' && selectedIndex !== null) {
      const current = questionsList[currentQuestionIndex]
      const correct = current.correctIndex === selectedIndex
      setIsCorrect(correct)
      setPhase('revealed')
      return
    }

    // Third click: advance or game over
    if (phase === 'revealed') {
      const current = questionsList[currentQuestionIndex]
      if (isCorrect) {
        const nextIndex = currentQuestionIndex + 1
        if (nextIndex >= questionsList.length) {
          setPhase('newGame')
        } else {
          setCurrentQuestionIndex(nextIndex)
        }
        setSelectedIndex(null)
        setIsCorrect(null)
        setPhase('selecting')
      } else {
        setPhase('newGame')
      }
    }
  }

  function restart() {
    setCurrentQuestionIndex(0)
    setSelectedIndex(null)
    setPhase('newGame')
    setIsCorrect(null)
    setQuestionsList(null)
  }

  const renderNewGameScreen = () => {
    return (
      <div className="app-container">
        <main className="app-main">
          <button
            className="restart-button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Load questions
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={loadQuestionsFromFile}
            style={{ display: 'none' }}
          />
        </main>
      </div>
    )
  }

  if (phase === 'newGame') {
    return renderNewGameScreen()
  }

  return (
    <div className="app-container" onClick={handleGlobalClick}>
      <header className="app-header">
        <h1>
          Question #{currentQuestionIndex + 1}
        </h1>
        <p>
          {questionsList[currentQuestionIndex].question}
        </p>
      </header>

      <main className="app-main">
        {questionsList[currentQuestionIndex].options.map((option, idx) => {
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


