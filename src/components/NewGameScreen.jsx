import React, { useRef } from 'react'

function NewGameScreen({ onFileChange }) {
  const fileInputRef = useRef(null)

  function openFileDialog() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="app-container">
      <main className="app-main">
        <button className="restart-button" onClick={openFileDialog}>
          Загрузить вопросы
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
      </main>
    </div>
  )
}

export default NewGameScreen


