import { Entity } from '../../engine/entity'

export type ReceiveMessage = {
  entity: Entity
  componentId: number
  timestamp: number
  transportId?: string
  data: Uint8Array
  messageBuffer: Uint8Array
}

export type TransportMessage = Omit<ReceiveMessage, 'data'>
