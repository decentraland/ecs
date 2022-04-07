import { DataViewExtended } from '../DataViewExtended'

export type ComponentOperation = {
  messageType: number
  entityId: bigint
  componentClassId: number
  timestamp: bigint
  data: Uint8Array
}

export function writeAnyMessage(
  buf: DataViewExtended,
  message: ComponentOperation
): void {
  // reserve the beginning
  const startMessageOffset = buf.poffset(8)

  // Write the body of message
  buf.view.setUint32(buf.poffset(4), message.messageType)
  buf.view.setUint32(buf.poffset(4), message.messageType)
  buf.view.setBigUint64(buf.poffset(8), message.entityId)
  buf.view.setUint32(buf.poffset(4), message.componentClassId)
  buf.view.setBigUint64(buf.poffset(8), message.timestamp)
  buf.view.setUint32(buf.poffset(4), message.data.byteLength)
  buf.buffer().set(message.data, buf.poffset(message.data.byteLength))

  // write header
  // Length
  buf.view.setUint32(startMessageOffset, buf.offset() - startMessageOffset)
  // Version
  buf.view.setUint32(startMessageOffset + 4, 0)
}
