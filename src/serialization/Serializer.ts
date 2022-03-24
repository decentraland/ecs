import ByteBuffer from 'bytebuffer'

export type Serializer = {
  bb: ByteBuffer
  push: (fn: () => void) => void
  getData: () => Uint8Array
}

export function createSerializer(): Serializer {
  const bb = ByteBuffer.allocate(2048, false, false)
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
      return new Uint8Array(bb.buffer.subarray(0, bb.offset))
    }
  }
}
