import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export default function HandMesh() {
  const ref = useRef()

  useFrame((state, delta) => {
    if (!ref.current) return
    const elapsed = state.clock.elapsedTime
    ref.current.rotation.y = elapsed * 0.5
    ref.current.position.y = 1.7 + Math.sin(elapsed * 1.8) * 0.1
  })

  return (
    <group ref={ref} position={[0, 1.7, 0.4]}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.28, 2]} />
        <meshStandardMaterial color="#a6f4ff" emissive="#61d4ff" emissiveIntensity={0.65} metalness={0.8} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.075, 16, 64]} />
        <meshBasicMaterial color="#73d6ff" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
