import React from 'react'

const GameOver = () => {
  return (
    <div id="gameover" style={{ display: 'none' }}>
      <div className="content">
        <h1>Game Over</h1>
        <p>Click to play again.</p>
      </div>
    </div>
  )
}

export default GameOver