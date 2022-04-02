import React from 'react'
import CanvasContainer from './components/CanvasContainer'
import GameOver from './components/GameOver'
import Instructions from './components/Instructions'
import Score from './components/Score'

function App() {

  return (
    <div className="App">
      <Instructions />
      <GameOver />
      <Score />
      <CanvasContainer />
    </div>
  )
}

export default App