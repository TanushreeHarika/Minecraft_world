import { useEffect, useRef, useState } from 'react'

export function useWebcam() {
  const videoRef = useRef(null)
  const [status, setStatus] = useState('initializing')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let mounted = true
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        if (!mounted) return
        video.srcObject = stream
        video.muted = true
        video.playsInline = true

        const onReady = () => {
          if (mounted) setStatus('ready')
          video.removeEventListener('loadeddata', onReady)
        }

        video.addEventListener('loadeddata', onReady)
        await video.play().catch(() => {
          // autoplay may be blocked until user interacts
          if (mounted && video.readyState >= 2) {
            setStatus('ready')
          }
        })
      } catch (error) {
        console.error('Webcam init failed', error)
        if (mounted) setStatus('error')
      }
    }

    startWebcam()

    return () => {
      mounted = false
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  return { videoRef, status }
}
