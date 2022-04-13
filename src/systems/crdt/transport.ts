export function createTransport(_type?: 'ws') {
  return new WebSocket('ws://localhost:8000')
}
