import { ComponentDefinition } from '../../engine/component'
import { ByteBuffer } from '../ByteBuffer'
import {
  MessageHeader,
  MessageType,
  MESSAGE_HEADER_CURRENT_VERSION,
  MESSAGE_HEADER_LENGTH,
  readMessageHeader
} from '../WireMessage'

export type PartialComponentOperation = {
  entityId: number
  componentClassId: number
  timestamp: number
  data: Uint8Array
}

export const COMPONENT_OPERATION_LENGTH = 24

/**
 * Call this function for an optimal writing data passing the ByteBuffer
 *  already allocated
 */
export function prepareAndWritePutComponentOperation(
  entityId: number,
  timestamp: number,
  componentDefinition: ComponentDefinition,
  messageBuf: ByteBuffer
) {
  // reserve the beginning
  const view = messageBuf.view()
  const startMessageOffset = messageBuf.incrementWriteOffset(
    MESSAGE_HEADER_LENGTH + COMPONENT_OPERATION_LENGTH
  )

  // write body
  componentDefinition.writeToByteBuffer(entityId, messageBuf)
  const messageLength =
    messageBuf.size() - startMessageOffset - MESSAGE_HEADER_LENGTH

  // Write header
  view.setUint32(startMessageOffset, messageLength)
  view.setUint32(startMessageOffset + 4, MESSAGE_HEADER_CURRENT_VERSION)
  view.setUint32(startMessageOffset + 8, MessageType.PUT_COMPONENT)
  view.setBigInt64(startMessageOffset + 12, BigInt(entityId))
  view.setUint32(startMessageOffset + 20, componentDefinition._id)
  view.setBigInt64(startMessageOffset + 24, BigInt(timestamp))
  view.setUint32(
    startMessageOffset + 32,
    messageLength - COMPONENT_OPERATION_LENGTH
  )
}

/**
 * Write a component operation with a custom packed data
 */
export function writePutComponentOperation(
  entityId: number,
  timestamp: number,
  componentClassId: number,
  data: Uint8Array,
  messageBuf: ByteBuffer
) {
  // reserve the beginning
  const view = messageBuf.view()
  const startMessageOffset = messageBuf.incrementWriteOffset(
    MESSAGE_HEADER_LENGTH + COMPONENT_OPERATION_LENGTH
  )

  // write body
  messageBuf.writeBuffer(data, false)
  const messageLength =
    messageBuf.size() - startMessageOffset - MESSAGE_HEADER_LENGTH

  // Write header
  view.setUint32(startMessageOffset, messageLength)
  view.setUint32(startMessageOffset + 4, MESSAGE_HEADER_CURRENT_VERSION)
  view.setUint32(startMessageOffset + 8, MessageType.PUT_COMPONENT)
  view.setBigInt64(startMessageOffset + 12, BigInt(entityId))
  view.setUint32(startMessageOffset + 20, componentClassId)
  view.setBigInt64(startMessageOffset + 24, BigInt(timestamp))
  view.setUint32(startMessageOffset + 32, data.length)
}

export function readPutComponentOperationWithoutData(
  buf: ByteBuffer
): (MessageHeader & PartialComponentOperation) | null {
  const header = readMessageHeader(buf)
  if (!header) {
    return null
  }

  const view = buf.view()
  const offset = buf.incrementReadOffset(24)

  return {
    ...header,
    entityId: Number(view.getBigUint64(offset)),
    componentClassId: view.getInt32(offset),
    timestamp: Number(view.getBigUint64(offset)),
    data: new Uint8Array(0)
  }
}
