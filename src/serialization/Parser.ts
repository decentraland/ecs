import { ByteBuffer, createByteBuffer } from './ByteBuffer'

export type Parser = {
  bb: ByteBuffer
}

export function createParser(dataArray: Uint8Array): Parser {
  const bb = createByteBuffer(dataArray)
  return {
    bb
  }
}
