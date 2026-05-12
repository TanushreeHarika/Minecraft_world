import { useEffect, useState } from 'react'

type Status = 'initializing' | 'ready' | 'tracking' | 'no-hand' | 'error'
type Gesture = 'palm' | 'point' | 'none'

interface HUDProps {
  status: Status
  gesture: Gesture
  blockCount: number
}

const STATUS_LABELS: Record<Status, { label: string; color: string }> = {
  initializing: { label: '⏳ Loading MediaPipe…', color: '#ffcc00' },
  ready:        { label: '📷 Waiting for hand…',  color: '#aaccff' },
  tracking:     { label: '✋ Hand Detected',        color: '#55ff55' },
  'no-hand':    { label: '👋 Show your hand',       color: '#ffaa44' },
  error:        { label: '❌ Camera Error',          color: '#ff4444' },
}

const GESTURE_ICONS: Record<Gesture, string> = {
  palm:  '🌿 Open Palm → Grass Block',
  point: '⚔️  Pointing  → Sword',
  none:  '',
}

export function HUD({ status, gesture, blockCount }: HUDProps) {
  const [punchFlash, setPunchFlash] = useState(false)

  // Flash effect feedback on block placement
  const prevCount = useState(blockCount)[0]
  useEffect(() => {
    if (blockCount > prevCount) {
      setPunchFlash(true)
      setTimeout(() => setPunchFlash(false), 300)
    }
  }, [blockCount])

  const { label, color } = STATUS_LABELS[status] || STATUS_LABELS.ready

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      fontFamily: '"Courier New", monospace',
      zIndex: 10,
    }}>
      {/* ── Top status bar ───────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 16, left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.65)',
        border: '2px solid #555',
        borderRadius: 4,
        padding: '6px 18px',
        color,
        fontSize: 15,
        letterSpacing: '0.05em',
        textShadow: `0 0 8px ${color}`,
        backdropFilter: 'blur(4px)',
      }}>
        {label}
      </div>

      {/* ── Gesture indicator ───────────────────────────────────── */}
      {gesture && gesture !== 'none' && (
        <div style={{
          position: 'absolute',
          top: 60, left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.5)',
          border: '2px solid #3a3a3a',
          borderRadius: 4,
          padding: '4px 14px',
          color: gesture === 'point' ? '#aabbff' : '#88ff88',
          fontSize: 13,
          textShadow: gesture === 'point'
            ? '0 0 10px #aabbff'
            : '0 0 10px #88ff88',
        }}>
          {GESTURE_ICONS[gesture]}
        </div>
      )}

      {/* ── Block counter ────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 20, right: 20,
        background: 'rgba(0,0,0,0.7)',
        border: `2px solid ${punchFlash ? '#ffffaa' : '#555'}`,
        borderRadius: 4,
        padding: '6px 14px',
        color: punchFlash ? '#ffffaa' : '#cccccc',
        fontSize: 13,
        transition: 'border-color 0.15s, color 0.15s',
        textShadow: punchFlash ? '0 0 12px #ffffaa' : 'none',
      }}>
        ⛏ Blocks Placed: <strong>{blockCount}</strong>
      </div>

      {/* ── Instructions ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 20, left: 20,
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid #333',
        borderRadius: 4,
        padding: '8px 12px',
        color: '#888',
        fontSize: 11,
        lineHeight: 1.8,
      }}>
        <div style={{ color: '#aaa', marginBottom: 2, fontSize: 12 }}>Controls</div>
        🖐 Open palm → hold Grass Block<br />
        ☝️  Point index → equip Sword<br />
        👊 Punch forward → place block
      </div>

      {/* ── Punch flash overlay ──────────────────────────────────── */}
      {punchFlash && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,100,0.12)',
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
        }} />
      )}
    </div>
  )
}