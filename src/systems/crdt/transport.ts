type OnData = (data: MessageEvent<Uint8Array>) => void

export function createTransport({ onData }: { onData: OnData }) {
  const ws = new WebSocket('ws://localhost:8000')
  ws.onmessage = onData
  return ws
}
