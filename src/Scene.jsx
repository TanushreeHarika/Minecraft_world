import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import GrassBlock from './GrassBlock.jsx'
import Sword from './Sword.jsx'
import PlacedBlocks from './PlacedBlocks.jsx'
import HandMesh from './HandMesh.jsx'

function VideoBackdrop({ video }) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!video) return
    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    videoTexture.format = THREE.RGBAFormat
    videoTexture.needsUpdate = true
    setTexture(videoTexture)
    return () => {
      videoTexture.dispose()
    }
  }, [video])

  if (!texture) return null

  return (
    <mesh position={[0, 2, -10]} rotation={[0, 0, 0]}>
      <planeGeometry args={[24, 14]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

export default function Scene({ videoRef }) {
  const [video, setVideo] = useState(null)

  useEffect(() => {
    if (videoRef.current) {
      setVideo(videoRef.current)
    }
  }, [videoRef])

  const skyColor = '#0b1020'

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      camera={{ position: [0, 4.5, 10], fov: 38 }}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    >
      <fog attach="fog" args={['#070b16', 8, 20]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[6, 10, 6]}
        intensity={1.6}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <Suspense fallback={null}>
        <VideoBackdrop video={video} />
      </Suspense>

      <group position={[0, -1.35, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.22} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#080f1c" metalness={0.1} roughness={0.75} />
        </mesh>
      </group>

      <GrassBlock position={[-1.6, 0.5, 0.8]} />
      <GrassBlock position={[1.4, 0.55, -0.8]} scale={[0.92, 0.92, 0.92]} />
      <PlacedBlocks />
      <Sword />
      <HandMesh />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.75}
          intensity={1.2}
          radius={0.5}
          opacity={1}
        />
      </EffectComposer>
    </Canvas>
  )
}
