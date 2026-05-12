export default function PlacedBlocks() {
  const positions = [
    [-2.4, 0.35, -1.2],
    [2.2, 0.35, 1.4],
    [0.8, 0.35, 1.8],
    [-1.8, 0.35, 1.2],
  ]

  return (
    <group>
      {positions.map((pos, index) => (
        <mesh key={index} position={pos} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color={index % 2 ? '#28503c' : '#4f6d3f'} metalness={0.2} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
