import { useMemo } from 'react'
import * as THREE from 'three'
import { grassTopTexture, grassSideTexture, dirtTexture } from './textures.js'

export default function GrassBlock({ position = [0, 0, 0], scale = [1, 1, 1] }) {
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ map: grassSideTexture, metalness: 0.1, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ map: grassSideTexture, metalness: 0.1, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ map: grassTopTexture, metalness: 0.15, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ map: dirtTexture, metalness: 0.05, roughness: 0.95 }),
      new THREE.MeshStandardMaterial({ map: grassSideTexture, metalness: 0.1, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ map: grassSideTexture, metalness: 0.1, roughness: 0.85 }),
    ],
    [],
  )

  return (
    <mesh position={position} scale={scale} castShadow receiveShadow geometry={new THREE.BoxGeometry(1, 1, 1)} material={materials}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  )
}
