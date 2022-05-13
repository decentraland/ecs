import { TransportMessage } from './types'

export type Transport = {
  type: string
  send(message: Uint8Array): void
  onmessage(message: MessageEvent<Uint8Array>): void
  filter(message: TransportMessage): boolean
}

function networkTransport(): Transport {
  const type = 'network-transport'
  return {
    type,
    filter: (message) => {
      // TODO: filter component id for renderer.
      return message.transportId !== type && !!message.componentId
    },

    // TODO: implemnet transport rpc
    send: () => {},
    onmessage: () => {}
  }
}

export function getTransports() {
  return [networkTransport()]
}
