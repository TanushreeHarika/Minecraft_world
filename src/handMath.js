export function lerp(start, end, t) {
  return start + (end - start) * t
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}
