import {
  World,
  NaiveBroadphase
} from 'cannon'
import { BLOCK, cutBlock, generateBase } from '../lib/block'
import { loadLights, loadScene } from '../lib/canvas'
import { addLayer, addOverhang, overhangs, stack } from '../lib/stack'

let gameStarted = false
let gameOver = false
let scene, camera, renderer
let world

export const init = (canvasRef) => {
  // Initialize CannonJS
  world = new World()
  world.gravity.set(0, -10, 0)
  world.broadphase = new NaiveBroadphase()
  world.solver.iterations = 40;

  // Initialize ThreeJS
  ({ scene, camera, renderer } = loadScene())
  const [ambientLight, directionalLight] = loadLights()

  generateBase(scene)

  addLayer(scene, world, { x: 0, z: 0 }, BLOCK.WIDTH, BLOCK.DEPTH)
  addLayer(scene, world, { x: -10, z: 0 }, BLOCK.WIDTH, BLOCK.DEPTH, "x")

  scene.add(ambientLight)
  scene.add(directionalLight)

  renderer.render(scene, camera)

  canvasRef.current.appendChild(renderer.domElement)
}

const animation = () => {
  const speed = 0.15

  const topLayer = stack[stack.length - 1]
  // Update ThreeJS model
  topLayer.block.position[topLayer.direction] += speed

  // Update CannonJS body
  topLayer.body.position[topLayer.direction] += speed

  // Drop the block after moving for a while without user click
  if (topLayer.block.position.x > 10 && gameStarted == true) {
    addOverhang(
      scene,
      world,
      topLayer.block.position.x,
      topLayer.block.position.z,
      topLayer.width,
      topLayer.depth
    )
    world.remove(topLayer.body)
    scene.remove(topLayer.block)
    gameStarted = false
    document.querySelector('#gameover').style.display = 'flex'
    gameOver = true
  }

  if (camera.position.y < BLOCK.HEIGHT * (stack.length - 2) + 4) {
    camera.position.y += speed
  }

  updatePhysics()
  renderer.render(scene, camera)
}

const updatePhysics = () => {
  world.step(1 / 60)

  // Copy coordinates from CannonJS to ThreeJS
  overhangs.forEach(element => {
    element.block.position.copy(element.body.position)
    element.block.quaternion.copy(element.body.quaternion)
  })
}

export const gameLoop = () => {
  if (gameOver) {
    document.location.reload()
  }
  if (!gameStarted) {
    renderer.setAnimationLoop(animation)
    document.querySelector('#instructions').style.display = 'none'
    gameStarted = true
  } else {
    const topLayer = stack[stack.length - 1]
    const previousLayer = stack[stack.length - 2]

    const direction = topLayer.direction

    const delta = topLayer.block.position[direction] - previousLayer.block.position[direction]

    const overhang = Math.abs(delta)

    const size = direction === "x" ? topLayer.width : topLayer.depth

    const overlap = size - overhang

    if (overlap > 0) {
      // Cut Top Layer block
      cutBlock(topLayer, overlap, size, delta)

      // Create the Overhang block (the one that will fall)
      const overhangShift = (overlap / 2 + overhang / 2) * Math.sign(delta)
      const overhangX = direction === "x"
        ? topLayer.block.position.x + overhangShift
        : topLayer.block.position.x
      const overhangZ = direction === "z"
        ? topLayer.block.position.z + overhangShift
        : topLayer.block.position.z

      const overhangWidth = direction === "x" ? overhang : topLayer.width
      const overhangDepth = direction === "z" ? overhang : topLayer.depth

      addOverhang(scene, world, overhangX, overhangZ, overhangWidth, overhangDepth)

      // Next Block
      const nextX = direction === "x" ? topLayer.block.position.x : -10
      const nextZ = direction === "z" ? topLayer.block.position.z : -10
      const newWidth = topLayer.width
      const newDepth = topLayer.depth
      const nextDirection = direction === "x" ? "z" : "x"

      document.querySelector('#score').innerText = stack.length - 1
      addLayer(scene, world, { x: nextX, z: nextZ }, newWidth, newDepth, nextDirection)
    } else {
      addOverhang(
        scene,
        world,
        topLayer.block.position.x,
        topLayer.block.position.z,
        topLayer.width,
        topLayer.depth
      )
      world.remove(topLayer.body)
      scene.remove(topLayer.block)
      document.querySelector('#gameover').style.display = 'flex'
      gameOver = true
    }
  }
}

export const handleWindowResize = () => {
  const container = document.querySelector('#container')
  const aspect = container.clientWidth / container.clientHeight
  const frustumSize = 25

  camera.left = 0.5 * frustumSize * aspect / - 2
  camera.right = 0.5 * frustumSize * aspect / 2

  camera.updateProjectionMatrix()

  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.render(scene, camera)
}

export const disposeGame = (canvasRef) => {
  canvasRef.current.firstChild && canvasRef.current.removeChild(canvasRef.current.firstChild)
  renderer.dispose()
}