import {
  Scene,
  Color,
  OrthographicCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight
} from 'three'

export const loadScene = () => {
  const container = document.querySelector('#container')
  // console.log(container)
  const ratio = container.clientWidth / container.clientHeight
  const aspect = ratio < 0.7 ? 0.7 : ratio

  // console.log(aspect)

  const frustumSize = 25

  const scene = new Scene()
  // scene.background = new Color(0x444444);

  const camera = new OrthographicCamera(
    0.5 * frustumSize * aspect / -2,
    0.5 * frustumSize * aspect / 2,
    frustumSize * aspect / 2,
    frustumSize * aspect / -2,
    1,
    100
  )
  camera.position.set(5, 5, 5)
  camera.lookAt(0, 0, 0)
  camera.position.y = 10

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setClearColor(0x000000, 0.0)

  return {
    scene,
    camera,
    renderer
  }
}

export const loadLights = () => {
  const ambientLight = new AmbientLight(0xffffff, 0.5)
  const directionalLight = new DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(10, 20, 0)

  return [
    ambientLight,
    directionalLight
  ]
}