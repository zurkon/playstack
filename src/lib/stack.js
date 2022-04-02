import { BLOCK, generateBlock } from "./block"

export let stack = []
export let overhangs = []

export const addLayer = (scene, world, { x, z }, width, depth, direction) => {
  const y = BLOCK.HEIGHT * stack.length

  const layer = generateBlock(x, y, z, width, depth, stack.length, false)
  layer.direction = direction

  scene.add(layer.block)
  world.addBody(layer.body)

  stack.push(layer)
}

export const addOverhang = (scene, world, x, z, width, depth) => {
  const y = BLOCK.HEIGHT * (stack.length - 1)

  const overhang = generateBlock(x, y, z, width, depth, stack.length - 1, true)

  scene.add(overhang.block)
  world.addBody(overhang.body)

  overhangs.push(overhang)
}

export const resetStack = () => {
  stack = []
  overhangs = []
}