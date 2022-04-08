import { ByteBuffer, createByteBuffer } from './ByteBuffer'

export type Serializer = {
  bb: ByteBuffer
  getData: () => Uint8Array
}

export function createSerializer(): Serializer {
  const bb = createByteBuffer()

  return {
    bb,
    getData(): Uint8Array {
      return bb.toBinary()
    }
  }
}
