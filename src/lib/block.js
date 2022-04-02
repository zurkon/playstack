import {
  BoxGeometry,
  Color,
  MeshPhongMaterial,
  Mesh
} from 'three'
import {
  Box,
  Body,
  Vec3
} from 'cannon'

export const BLOCK = {
  HEIGHT: 1,
  WIDTH: 4,
  DEPTH: 4
}

export const generateBlock = (x, y, z, width, depth, colorValue, falls) => {
  const geometry = new BoxGeometry(width, BLOCK.HEIGHT, depth)
  const color = new Color(`hsl(${140 + colorValue * 5}, 100%, 60%)`)
  const material = new MeshPhongMaterial({ color })
  const block = new Mesh(geometry, material)

  block.position.set(x, y, z)

  // CannonJS
  const shape = new Box(
    new Vec3(width / 2, BLOCK.HEIGHT / 2, depth / 2)
  )
  const mass = falls ? 5 : 0
  const body = new Body({ mass, shape })
  body.position.set(x, y, z)

  return {
    block: block,
    body: body,
    width: width,
    depth: depth
  }
}

export const cutBlock = (topLayer, overlap, size, delta) => {
  const direction = topLayer.direction
  const newWidth = direction === "x" ? overlap : topLayer.width
  const newDepth = direction === "z" ? overlap : topLayer.depth

  // Update metadata
  topLayer.width = newWidth
  topLayer.depth = newDepth

  // Update ThreeJS model
  topLayer.block.scale[direction] = overlap / size
  topLayer.block.position[direction] -= delta / 2

  // Update CannonJS model
  topLayer.body.position[direction] -= delta / 2

  // Replace shape to a smaller one
  const shape = new Box(
    new Vec3(newWidth / 2, BLOCK.HEIGHT / 2, newDepth / 2)
  )

  topLayer.body.shapes = []
  topLayer.body.addShape(shape)
}

export const generateBase = (scene) => {
  const geometry = new BoxGeometry(4, 12, 4)
  const material = new MeshPhongMaterial({ color: 0x7bffad })
  const base = new Mesh(geometry, material)
  base.position.set(0, -6.5, 0)
  scene.add(base)
}