import React from 'react'

function GameOverScreen({ onRestart }) {
  return (
    <div className="app-container" onClick={onRestart}>
      <main className="app-main" style={{ cursor: 'pointer', textAlign: 'center' }}>
        <h1>Game Over</h1>
      </main>
    </div>
  )
}

export default GameOverScreen


