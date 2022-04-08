import { ByteBuffer, createByteBuffer } from './ByteBuffer'

export type Serializer = {
  bb: ByteBuffer
  push: (fn: () => void) => void
  getData: () => Uint8Array
}

export function createSerializer(): Serializer {
  const bb = createByteBuffer()
  const fnQueue: (() => void)[] = []

  return {
    bb,
    push(fn: () => void): void {
      fnQueue.push(fn)
    },
    getData(): Uint8Array {
      for (const fn of fnQueue) {
        fn()
      }
      return bb.toBinary()
    }
  }
}
