export function measureTime(f: () => void) {
  const initialTime = performance.now()
  f()
  const dt = performance.now() - initialTime
  return dt
}
