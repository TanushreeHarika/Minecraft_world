import * as THREE from 'three'

function createSolidTexture(r, g, b) {
  const size = 16
  const data = new Uint8Array(size * size * 4)
  for (let i = 0; i < size * size; i += 1) {
    data[i * 4] = r
    data[i * 4 + 1] = g
    data[i * 4 + 2] = b
    data[i * 4 + 3] = 255
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
}

export const grassTopTexture = createSolidTexture(96, 160, 64)
export const grassSideTexture = createSolidTexture(86, 137, 58)
export const dirtTexture = createSolidTexture(129, 92, 55)
