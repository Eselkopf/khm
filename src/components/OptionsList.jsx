import React from 'react'

function OptionsList({ options, selectedIndex, isRevealed, isCorrect, phase, onOptionClick }) {
  return (
    <main className="app-main">
      {options.map((option, idx) => {
        let buttonClass = 'quiz-button'

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
            onClick={(e) => onOptionClick(idx, e)}
            className={buttonClass}
          >
            <span className="button-prefix">{String.fromCharCode(65 + idx)}:</span>{' '}
            <span className="button-text">{option}</span>
          </button>
        )
      })}
    </main>
  )
}

export default OptionsList


