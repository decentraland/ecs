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
    messageBuf: ByteBuffer
  ) {
    // reserve the beginning
    const view = messageBuf.view()
    const startMessageOffset = messageBuf.incrementWriteOffset(
      WireMessage.HEADER_LENGTH + MESSAGE_LENGTH
    )

    // write body
    componentDefinition.writeToByteBuffer(entityId, messageBuf)
    const messageLength =
      messageBuf.size() - startMessageOffset - WireMessage.HEADER_LENGTH

    // Write header
    view.setUint32(startMessageOffset, messageLength)
    view.setUint32(startMessageOffset + 4, WireMessage.HEADER_CURRENT_VERSION)
    view.setUint32(startMessageOffset + 8, WireMessage.Enum.PUT_COMPONENT)
    view.setBigInt64(startMessageOffset + 12, BigInt(entityId))
    view.setUint32(startMessageOffset + 20, componentDefinition._id)
    view.setBigInt64(startMessageOffset + 24, BigInt(timestamp))
    view.setUint32(startMessageOffset + 32, messageLength - MESSAGE_LENGTH)
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
    messageBuf: ByteBuffer
  ) {
    // reserve the beginning
    const view = messageBuf.view()
    const startMessageOffset = messageBuf.incrementWriteOffset(
      WireMessage.HEADER_LENGTH + MESSAGE_LENGTH
    )

    // write body
    messageBuf.writeBuffer(data, false)
    const messageLength =
      messageBuf.size() - startMessageOffset - WireMessage.HEADER_LENGTH

    // Write header
    view.setUint32(startMessageOffset, messageLength)
    view.setUint32(startMessageOffset + 4, WireMessage.HEADER_CURRENT_VERSION)
    view.setUint32(startMessageOffset + 8, WireMessage.Enum.PUT_COMPONENT)
    view.setBigInt64(startMessageOffset + 12, BigInt(entityId))
    view.setUint32(startMessageOffset + 20, componentClassId)
    view.setBigInt64(startMessageOffset + 24, BigInt(timestamp))
    view.setUint32(startMessageOffset + 32, data.length)
  }

  export function read(buf: ByteBuffer): (WireMessage.Header & Type) | null {
    const header = WireMessage.readHeader(buf)
    if (!header) {
      return null
    }
    const messageSize = header.length + WireMessage.HEADER_LENGTH

    const view = buf.view()
    const offset = buf.incrementReadOffset(WireMessage.HEADER_LENGTH)

    return {
      ...header,
      entityId: Number(view.getBigUint64(offset)) as Entity,
      componentClassId: view.getInt32(offset + 8),
      timestamp: Number(view.getBigUint64(offset + 4 + 8)),
      data: buf.buffer().subarray(buf.currentReadOffset() + 12, messageSize)
    }
  }
}
