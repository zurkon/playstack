import React, { useEffect, useRef } from 'react'
import { disposeGame, gameLoop, handleWindowResize, init } from '../lib/game'
import { resetStack } from '../lib/stack'


const CanvasContainer = () => {
  const canvasRef = useRef()

  useEffect(() => {

    init(canvasRef)

    window.addEventListener("click", gameLoop)

    window.addEventListener("resize", handleWindowResize)

    return () => {
      console.log('unmount')
      disposeGame(canvasRef)
      resetStack()
    }

  }, [])

  return (
    <div id="container" ref={canvasRef}>
    </div>
  )
}

export default CanvasContainer