type OnData = (id: string) => (data: MessageEvent<Uint8Array>) => void
type Transport = WebSocket & { id: string }
type Params = { onData: OnData; id: string }

export function createTransport({ onData, id }: Params): Transport {
  const ws: Transport = new WebSocket('ws://localhost:8000') as any as Transport
  ws.onmessage = onData(id)
  ;(ws as Transport).id = id
  return ws
}
