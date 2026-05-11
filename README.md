# ⛏ Minecraft AR – Hand Tracker

A real-time **Augmented Reality** Minecraft experience powered by:
- **MediaPipe HandLandmarker** – 21-point hand skeleton tracking
- **React Three Fiber (@react-three/fiber)** – declarative Three.js in React
- **Pixel-art textures** – 16×16 `NearestFilter` Minecraft-style sprites
- **UnrealBloom** – glowing enchantment post-processing
- **DirectionalLight + hard shadows** – pixel-perfect depth

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` → **allow camera access** → hold up your hand.

---

## 🎮 Gestures

| Gesture | Effect |
|---------|--------|
| 🖐 **Open Palm** (3+ fingers extended) | Holds a Grass Block above palm |
| ☝️ **Point** (index up, others curled) | Switches to Sword with spring pop animation |
| 👊 **Punch forward** (Z-axis velocity spike) | Spawns a block in 3D space, grid-snapped |

---

## 📁 Project Structure

```
minecraft-ar/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  # React root
    ├── components/
    │   ├── App.jsx               # Top-level layout (webcam + scene + HUD)
    │   ├── Scene.jsx             # R3F Canvas, lighting, bloom, shadow plane
    │   ├── HandMesh.jsx          # Palm tracker + held item switcher + punch detect
    │   ├── GrassBlock.jsx        # Minecraft grass block (6-face pixel textures)
    │   ├── Sword.jsx             # Sword plane with spring pop animation
    │   ├── PlacedBlocks.jsx      # Grid of spawned blocks
    │   └── HUD.jsx               # 2D overlay: status, gesture, counter, instructions
    ├── hooks/
    │   ├── useWebcam.js          # getUserMedia → <video> element
    │   └── useMediaPipe.js       # HandLandmarker detection loop
    └── utils/
        ├── textures.js           # 16×16 pixel-art DataTexture generators
        └── handMath.js           # lerp, gesture detection, punch, grid snap
```

---

## 🏗️ Architecture

### Hand Tracking Pipeline

```
Webcam → <video> → MediaPipe HandLandmarker
                          │
                    21 landmarks (x,y,z normalized)
                          │
                    lerpPoint() ← smooths jitter (t=0.18)
                          │
                    landmarkToWorld() ← maps to Three.js world space
                          │
               ┌──────────┼──────────────┐
          getPalmCenter()  isOpenPalm()  isPointing()  isPunch(zVelocity)
               │                │              │              │
          <HandMesh>         GrassBlock      Sword        onPunch()
          position            visible        spring       snapToGrid()
                                            pop anim      → PlacedBlocks
```

### Render Loop (`useFrame`)

Each frame in `HandMesh.jsx`:
1. Get smoothed palm center via lerp
2. Move `<group>` to palm world position
3. Check gesture → show/hide GrassBlock or Sword
4. Measure Z-axis velocity delta
5. If punch threshold exceeded + cooldown clear → fire `onPunch(snappedPos)`

### Texture System

All textures are generated at runtime from `Uint8Array` pixel data:

```js
const tex = new THREE.DataTexture(data, 16, 16, THREE.RGBAFormat)
tex.magFilter = THREE.NearestFilter  // ← Minecraft pixel-art look
tex.minFilter = THREE.NearestFilter
```

Six unique materials per `GrassBlock` face: **top** (green), **sides** (grass+dirt blend), **bottom** (pure dirt).

### Post-Processing

```jsx
<EffectComposer>
  <Bloom
    intensity={1.2}
    luminanceThreshold={0.55}  // only bright areas glow
    kernelSize={KernelSize.MEDIUM}
    blendFunction={BlendFunction.ADD}
    mipmapBlur
  />
</EffectComposer>
```

### Shadow System

```jsx
<directionalLight
  castShadow
  shadow-radius={0}        // hard, pixelated shadows
  shadow-mapSize={1024}
/>
<mesh receiveShadow>
  <shadowMaterial opacity={0.35} />
</mesh>
```

---

## ⚙️ Configuration

| Constant | Location | Default | Purpose |
|----------|----------|---------|---------|
| `LERP_SPEED` | `HandMesh.jsx` | `0.18` | Hand jitter smoothing (0=frozen, 1=raw) |
| `PUNCH_COOLDOWN` | `HandMesh.jsx` | `0.6s` | Min time between block placements |
| `isPunch threshold` | `handMath.js` | `0.04` | Z-velocity required to trigger punch |
| `snapToGrid size` | `handMath.js` | `1.0` | World-unit grid for block snapping |
| `landmarkToWorld scale` | `handMath.js` | `{x:10,y:-7,z:5}` | Maps MediaPipe→Three.js coordinates |

---

## 🔧 Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `@mediapipe/tasks-vision` | 0.10.14 | Hand landmark detection |
| `@react-three/fiber` | 8.x | React + Three.js renderer |
| `@react-three/postprocessing` | 2.x | Bloom / UnrealBloom |
| `postprocessing` | 6.x | Effect composer |
| `three` | 0.168 | 3D engine |
| `react` | 18 | UI framework |
| `vite` | 5 | Dev server + bundler |

---

## 🐛 Troubleshooting

**Camera not working?**
- Must be served over HTTPS or localhost
- Grant camera permissions in browser
- Check `vite.config.js` COOP/COEP headers are present (required for MediaPipe WASM)

**Hand not detected?**
- Ensure good lighting on your hand
- Keep hand within 30–80cm of camera
- MediaPipe model loads from CDN on first run (~5MB)

**Performance?**
- `antialias: false` on Canvas for pixel-art aesthetic + performance
- `multisampling={0}` on EffectComposer
- Reduce `blockCount` limit in `PlacedBlocks.jsx` if needed