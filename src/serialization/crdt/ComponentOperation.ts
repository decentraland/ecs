import { ByteBuffer } from '../ByteBuffer'
import {
  MessageHeader,
  MessageType,
  MESSAGE_HEADER_CURRENT_VERSION,
  MESSAGE_HEADER_LENGTH,
  readMessageHeader
} from '../WireMessage'

// TODO: see bigint
export type PartialComponentOperation = {
  entityId: bigint | number
  componentClassId: number
  timestamp: bigint | number
  data: Uint8Array
}

export const COMPONENT_OPERATION_LENGTH = 24

/**
 * Call this function for an optimal writing data passing the ByteBuffer
 *  already created and a callback
 * @param writeData
 * @param messageBuf
 */
export function prepareAndWritePutComponentOperation(
  entityId: bigint,
  componentClassId: number,
  timestamp: bigint,
  writeData: (buf: ByteBuffer) => void,
  messageBuf: ByteBuffer
) {
  // reserve the beginning
  const view = messageBuf.view()
  const startMessageOffset = messageBuf.incrementWriteOffset(
    MESSAGE_HEADER_LENGTH + COMPONENT_OPERATION_LENGTH
  )

  // write body
  writeData(messageBuf)
  const messageLength =
    messageBuf.size() - startMessageOffset - MESSAGE_HEADER_LENGTH

  // Write hedaer
  view.setUint32(startMessageOffset, messageLength)
  view.setUint32(startMessageOffset + 4, MESSAGE_HEADER_CURRENT_VERSION)
  view.setUint32(startMessageOffset + 8, MessageType.PUT_COMPONENT)
  view.setBigInt64(startMessageOffset + 12, entityId)
  view.setUint32(startMessageOffset + 20, componentClassId)
  view.setBigInt64(startMessageOffset + 24, timestamp)
  view.setUint32(
    startMessageOffset + 32,
    messageLength - COMPONENT_OPERATION_LENGTH
  )
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
    entityId: view.getBigUint64(offset),
    componentClassId: view.getInt32(offset),
    timestamp: view.getBigUint64(offset),
    data: new Uint8Array(0)
  }
}
