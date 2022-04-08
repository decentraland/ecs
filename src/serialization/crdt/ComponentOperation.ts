import { createByteBuffer, ByteBuffer } from '../ByteBuffer'

export enum MessageType {
  PUT_COMPONENT = 1,
  DELETE_COMPONENT = 2
}

// TODO: see bigint
export type PartialComponentOperation = {
  entityId: bigint | number
  componentClassId: number
  timestamp: bigint | number
  data: Uint8Array
}

export type DeleteComponentOperation = PartialComponentOperation & {
  messageType: MessageType.DELETE_COMPONENT
}

export type PutComponentOperation = PartialComponentOperation & {
  messageType: MessageType.PUT_COMPONENT
}

export type WireMessage = PutComponentOperation | DeleteComponentOperation

const CURRENT_VERSION = 0

export function writeMessage(
  wrapMessage: (buf: ByteBuffer) => MessageType,
  messageBuf: ByteBuffer = createByteBuffer()
) {
  // reserve the beginning
  const startMessageOffset = messageBuf.reserve(12)

  // write body
  const messageType = wrapMessage(messageBuf)

  // write header
  // Length
  messageBuf
    .view()
    .setUint32(
      startMessageOffset,
      messageBuf.offset() - startMessageOffset - 12
    )
  // Version
  messageBuf.view().setUint32(startMessageOffset + 4, CURRENT_VERSION)
  messageBuf.view().setUint32(startMessageOffset + 8, messageType)

  return messageBuf
}

export function writeComponentOperation(
  message: WireMessage,
  messageBuf?: ByteBuffer
): ByteBuffer {
  const writeBody = (buf: ByteBuffer) => {
    buf.writeUint64(BigInt(message.entityId))
    buf.writeUint32(message.componentClassId)
    buf.writeUint64(BigInt(message.timestamp))
    buf.writeBuffer(message.data)
    return message.messageType
  }

  return writeMessage(writeBody, messageBuf)
}

export function writePutComponentOperation(
  message: PartialComponentOperation,
  messageBuf?: ByteBuffer
): ByteBuffer {
  // TODO: to not break the performance : :
  ;(message as PutComponentOperation).messageType = MessageType.PUT_COMPONENT
  return writeComponentOperation(message as PutComponentOperation, messageBuf)
}
