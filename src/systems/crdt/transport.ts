export type Transport = {
  send: (data: Uint8Array) => void
  onData: (cb: (data: Uint8Array) => void) => void
}

export function createWsTransport(url?: string): Transport {
  const ws = new WebSocket(url || 'ws://localhost/test')

  return {
    send: (data: Uint8Array) => {
      ws.send(data)
    },
    onData: (cb: (data: Uint8Array) => void) => {
      ws.onmessage = (chunkMessage: MessageEvent<Uint8Array>) => {
        if (!chunkMessage.data?.length) return
        cb(chunkMessage.data)
      }
    }
  }
}