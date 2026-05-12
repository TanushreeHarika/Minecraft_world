import { useWebcam } from './useWebcam.js'
import { useMediaPipe } from './useMediaPipe.js'
import { HUD } from './HUD.tsx'
import Scene from './Scene.jsx'

function App() {
  const { videoRef, status: webcamStatus } = useWebcam()
  const { status, gesture, blockCount } = useMediaPipe(videoRef, webcamStatus)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(1.12) contrast(1.05) saturate(1.3)',
          opacity: 0.98,
          zIndex: -2,
        }}
      />
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 18%), radial-gradient(circle at bottom right, rgba(64, 180, 255, 0.08), transparent 16%)',
        pointerEvents: 'none',
        zIndex: -1,
      }} />

      <Scene videoRef={videoRef} />
      <HUD status={status} gesture={gesture} blockCount={blockCount} />
    </div>
  )
}

export default App
