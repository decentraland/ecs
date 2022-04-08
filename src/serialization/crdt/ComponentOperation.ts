import { createByteBuffer, ByteBuffer } from '../ByteBuffer'
import { createDataViewExtended, DataViewExtended } from '../DataViewExtended'

export enum MessageType {
  PUT_COMPONENT = 1,
  DELETE_COMPONENT = 2
}

// TODO: see bigint
export type ComponentOperation<T extends MessageType> = {
  messageType: T
  entityId: bigint | number
  componentClassId: number
  timestamp: bigint | number
  data: Uint8Array
}

export type DeleteComponentOperation =
  ComponentOperation<MessageType.DELETE_COMPONENT>
export type PutComponentOperation =
  ComponentOperation<MessageType.PUT_COMPONENT>

export type WireMessage = PutComponentOperation | DeleteComponentOperation

const CURRENT_VERSION = 0
export function writeComponentOperation(
  message: WireMessage,
  messageBuf: ByteBuffer = createByteBuffer()
): ByteBuffer {
  // reserve the beginning
  const startMessageOffset = messageBuf.reserve(12)

  // Write the body of message
  messageBuf.writeUint64(BigInt(message.entityId))
  messageBuf.writeUint32(message.componentClassId)
  messageBuf.writeUint64(BigInt(message.timestamp))
  messageBuf.writeUint32(message.data.byteLength)
  messageBuf
    .buffer()
    .set(message.data, messageBuf.reserve(message.data.byteLength))

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
  messageBuf.view().setUint32(startMessageOffset + 8, message.messageType)

  return messageBuf
}
