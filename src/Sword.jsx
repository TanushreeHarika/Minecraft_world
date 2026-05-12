import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export default function Sword() {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.35
      ref.current.position.y = 1.8 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08
    }
  })

  return (
    <group ref={ref} position={[0, 1.9, -1.8]}>
      <mesh castShadow>
        <boxGeometry args={[0.12, 1.2, 0.14]} />
        <meshStandardMaterial color="#b8d8ff" emissive="#7fb8ff" emissiveIntensity={0.85} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.65, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.16, 0.16]} />
        <meshStandardMaterial color="#2f3b56" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  )
}
