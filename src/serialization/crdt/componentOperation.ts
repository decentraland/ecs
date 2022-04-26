import { ComponentDefinition } from '../../engine/component'
import { Entity } from '../../engine/entity'
import { ByteBuffer } from '../ByteBuffer'
import WireMessage from '../wireMessage'

export namespace PutComponentOperation {
  export type Type = {
    entityId: Entity
    componentClassId: number
    timestamp: number
    data: Uint8Array
  }

  export const MESSAGE_LENGTH = 24
  /**
   * Call this function for an optimal writing data passing the ByteBuffer
   *  already allocated
   */
  export function write(
    entityId: Entity,
    timestamp: number,
    componentDefinition: ComponentDefinition,
    buf: ByteBuffer
  ) {
    // reserve the beginning
    const startMessageOffset = buf.incrementWriteOffset(
      WireMessage.HEADER_LENGTH + MESSAGE_LENGTH
    )

    // write body
    componentDefinition.writeToByteBuffer(entityId, buf)
    const messageLength =
      buf.size() - startMessageOffset - WireMessage.HEADER_LENGTH

    // Write header
    buf.setUint32(startMessageOffset, messageLength)
    buf.setUint32(startMessageOffset + 4, WireMessage.HEADER_CURRENT_VERSION)
    buf.setUint32(startMessageOffset + 8, WireMessage.Enum.PUT_COMPONENT)
    buf.setUint64(startMessageOffset + 12, BigInt(entityId))
    buf.setUint32(startMessageOffset + 20, componentDefinition._id)
    buf.setUint64(startMessageOffset + 24, BigInt(timestamp))
    buf.setUint32(startMessageOffset + 32, messageLength - MESSAGE_LENGTH)
  }

  /**
   * @deprecated
   * Write a component operation with a custom packed data
   */
  export function _writePutComponent(
    entityId: number,
    timestamp: number,
    componentClassId: number,
    data: Uint8Array,
    buf: ByteBuffer
  ) {
    // reserve the beginning
    const startMessageOffset = buf.incrementWriteOffset(
      WireMessage.HEADER_LENGTH + MESSAGE_LENGTH
    )

    // write body
    buf.writeBuffer(data, false)
    const messageLength =
      buf.size() - startMessageOffset - WireMessage.HEADER_LENGTH

    // Write header
    buf.setUint32(startMessageOffset, messageLength)
    buf.setUint32(startMessageOffset + 4, WireMessage.HEADER_CURRENT_VERSION)
    buf.setUint32(startMessageOffset + 8, WireMessage.Enum.PUT_COMPONENT)
    buf.setUint64(startMessageOffset + 12, BigInt(entityId))
    buf.setUint32(startMessageOffset + 20, componentClassId)
    buf.setUint64(startMessageOffset + 24, BigInt(timestamp))
    buf.setUint32(startMessageOffset + 32, data.length)
  }

  export function read(buf: ByteBuffer): (WireMessage.Header & Type) | null {
    const header = WireMessage.readHeader(buf)

    if (!header) {
      return null
    }

    return {
      ...header,
      entityId: Number(buf.readUint64()) as Entity,
      componentClassId: buf.readInt32(),
      timestamp: Number(buf.readUint64()),
      data: buf.readBuffer()
    }
  }
}
