import { TransportMessage } from './types'

type Transport = {
  id: string
  send: WebSocket['send']
  filter: Params['filter']
}

type Params = {
  onData: (id: string) => (data: MessageEvent<Uint8Array>) => void
  id: string
  filter(message: TransportMessage): boolean
}

export function createTransport({ filter, onData, id }: Params): Transport {
  const ws = new WebSocket('ws://localhost:8000')
  ws.onmessage = onData(id)
  ;(ws as any).id = id

  return {
    id,
    filter,
    send: ws.send
  }
}
