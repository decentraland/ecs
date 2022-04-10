/**
 * The wire message is the top-level message that can be packed
 *  inside it can contain a data with another structure or protocol
 *
 * Each wire message has three primitive property that it'll never change
 *   ---> length        uint32 (message size up to 4,294,967,295)
 *   ---> version       uint32 (for now just a number which is zero)
 *   ---> message type  uint32
 * The length indicates how many bytes are above self, the version in
 * combination with message type defines the set of handlers that will be
 * available to process the message
 *
 */

import { ByteBuffer, createByteBuffer } from './ByteBuffer'

type Uint32 = number

export enum MessageType {
  RESERVED = 0,

  // Component Operation
  PUT_COMPONENT = 1,
  DELETE_COMPONENT = 2,

  MAX_MESSAGE_TYPE
}

export type MessageHeader = {
  length: Uint32
  version: Uint32
  type: Uint32
}

export const MESSAGE_HEADER_LENGTH = 12
export const MESSAGE_HEADER_CURRENT_VERSION: number = 0

export function writeMessageWithCb(
  wrapMessage: (buf: ByteBuffer) => MessageType,
  messageBuf: ByteBuffer = createByteBuffer()
) {
  // reserve the beginning
  const view = messageBuf.view()
  const startMessageOffset = messageBuf.incrementWriteOffset(
    MESSAGE_HEADER_LENGTH
  )

  // write body
  const messageType = wrapMessage(messageBuf)
  const messageLength =
    messageBuf.size() - startMessageOffset - MESSAGE_HEADER_LENGTH

  // Write hedaer
  view.setUint32(startMessageOffset, messageLength)
  view.setUint32(startMessageOffset + 4, MESSAGE_HEADER_CURRENT_VERSION)
  view.setUint32(startMessageOffset + 8, messageType)

  return messageBuf
}

/**
 * Validate if the message incoming is completed
 * @param buf
 */
export function validateIncommingWireMessage(buf: ByteBuffer) {
  const rem = buf.remainingBytes()
  if (rem < MESSAGE_HEADER_LENGTH) {
    return false
  }

  const messageLength = buf.view().getUint32(buf.currentReadOffset())
  if (rem < messageLength + MESSAGE_HEADER_LENGTH) {
    return false
  }

  return true
}

export function readMessageHeader(buf: ByteBuffer): MessageHeader | null {
  if (!validateIncommingWireMessage(buf)) {
    return null
  }

  return {
    length: buf.readUint32(),
    version: buf.readUint32(),
    type: buf.readUint32() as MessageType
  }
}
