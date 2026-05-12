import { useEffect, useRef, useState } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task'
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'

function isFingerExtended(landmarks, tipIndex, pipIndex) {
  return landmarks[tipIndex].y < landmarks[pipIndex].y
}

function getHandGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return 'none'

  const index = isFingerExtended(landmarks, 8, 6)
  const middle = isFingerExtended(landmarks, 12, 10)
  const ring = isFingerExtended(landmarks, 16, 14)
  const pinky = isFingerExtended(landmarks, 20, 18)

  if (index && !middle && !ring && !pinky) return 'point'
  if ([index, middle, ring, pinky].filter(Boolean).length >= 3) return 'palm'
  return 'none'
}

export function useMediaPipe(videoRef, webcamStatus) {
  const [status, setStatus] = useState('initializing')
  const [gesture, setGesture] = useState('none')
  const [blockCount, setBlockCount] = useState(4)
  const handLandmarkerRef = useRef(null)
  const previousZRef = useRef(null)
  const punchCooldownRef = useRef(0)
  const requestRef = useRef(null)

  useEffect(() => {
    if (webcamStatus === 'error') {
      setStatus('error')
      return
    }

    if (webcamStatus !== 'ready') {
      setStatus('initializing')
      return
    }

    let active = true

    const loadModel = async () => {
      try {
        setStatus('initializing')
        const filesetResolver = await FilesetResolver.forVisionTasks(WASM_URL)
        const handLandmarker = await HandLandmarker.createFromOptions({
          baseOptions: {
            modelAssetPath: MODEL_URL,
            filesetResolver,
          },
          runningMode: 'VIDEO',
          numHands: 1,
        })
        handLandmarkerRef.current = handLandmarker
        setStatus('ready')
        requestRef.current = requestAnimationFrame(detectFrame)
      } catch (error) {
        console.error('MediaPipe load failed', error)
        if (active) setStatus('error')
      }
    }

    const detectFrame = async () => {
      const video = videoRef.current
      const handLandmarker = handLandmarkerRef.current

      if (!active || !video || !handLandmarker) return

      if (video.readyState >= 2) {
        try {
          const result = handLandmarker.detectForVideo(video, performance.now())
          const hasHand = result?.landmarks?.length > 0

          if (hasHand) {
            setStatus('tracking')
            const landmarks = result.landmarks[0]
            const nextGesture = getHandGesture(landmarks)
            setGesture(nextGesture)

            const currentZ = landmarks[0].z
            const previousZ = previousZRef.current
            const now = performance.now()
            if (previousZ !== null && currentZ !== null) {
              const delta = previousZ - currentZ
              if (delta > 0.04 && now - punchCooldownRef.current > 700) {
                setBlockCount((count) => count + 1)
                punchCooldownRef.current = now
              }
            }
            previousZRef.current = currentZ
          } else {
            setStatus('no-hand')
            setGesture('none')
          }
        } catch (error) {
          console.error('MediaPipe detect error', error)
          setStatus('error')
        }
      }

      requestRef.current = requestAnimationFrame(detectFrame)
    }

    loadModel()

    return () => {
      active = false
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close()
        handLandmarkerRef.current = null
      }
    }
  }, [videoRef, webcamStatus])

  return { status, gesture, blockCount }
}
