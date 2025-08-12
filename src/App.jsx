import React, { useState } from 'react'
import './styles.css'
import NewGameScreen from './components/NewGameScreen.jsx'
import QuizHeader from './components/QuizHeader.jsx'
import OptionsList from './components/OptionsList.jsx'
import GameOverScreen from './components/GameOverScreen.jsx'
import QuizCompletedScreen from './components/QuizCompletedScreen.jsx'

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [phase, setPhase] = useState('newGame') // 'newGame' | 'selecting' | 'pendingReveal' | 'revealed' | 'gameOver' | 'quizCompleted'
  const [isCorrect, setIsCorrect] = useState(null) // true | false | null
  const [questionsList, setQuestionsList] = useState(null)

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

    // Third click: advance or game over / completed
    if (phase === 'revealed') {
      const current = questionsList[currentQuestionIndex]
      if (isCorrect) {
        const nextIndex = currentQuestionIndex + 1
        if (nextIndex >= questionsList.length) {
          setSelectedIndex(null)
          setIsCorrect(null)
          setPhase('quizCompleted')
          return
        } else {
          setCurrentQuestionIndex(nextIndex)
        }
        setSelectedIndex(null)
        setIsCorrect(null)
        setPhase('selecting')
      } else {
        setPhase('gameOver')
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

  if (phase === 'newGame') {
    return <NewGameScreen onFileChange={loadQuestionsFromFile} />
  }

  if (phase === 'gameOver') {
    return <GameOverScreen onRestart={restart} />
  }

  if (phase === 'quizCompleted') {
    return <QuizCompletedScreen onRestart={restart} />
  }

  return (
    <div className="app-container" onClick={handleGlobalClick}>
      <QuizHeader
        questionNumber={currentQuestionIndex + 1}
        text={questionsList[currentQuestionIndex].question}
      />
      <OptionsList
        options={questionsList[currentQuestionIndex].options}
        selectedIndex={selectedIndex}
        isRevealed={phase === 'revealed'}
        isCorrect={isCorrect}
        phase={phase}
        onOptionClick={handleOptionClick}
      />
    </div>
  )
}

export default App


