/**
 * Take the max between currentSize and intendedSize and then plus 1024. Then,
 *  find the next nearer multiple of 1024.
 * @param currentSize - number
 * @param intendedSize - number
 * @returns the calculated number
 */
function getNextSize(currentSize: number, intendedSize: number) {
  const minNewSize = Math.max(currentSize, intendedSize) + 1024
  return Math.ceil(minNewSize / 1024) * 1024
}

/**
 * ByteBuffer is a wrapper of DataView which also adds a read and write offset.
 *  Also in a write operation it resizes the buffer is being used if it needs.
 */
export interface ByteBuffer {
  /**
   * @returns The total number of bytes writen in the buffer.
   */
  size: () => number

  /**
   * @returns the reference to used DataView
   */
  view: () => DataView

  /**
   * @returns The subarray from 0 to offset.
   */
  toBinary: () => Uint8Array

  /**
   * @returns The entire buffer.
   */
  buffer: () => Uint8Array

  /**
   * @returns The capacity of the current buffer
   */
  bufferLength: () => number

  /**
   * @returns How many bytes are available to read.
   */
  remainingBytes: () => number

  /**
   * @returns The current read offset.
   */
  currentReadOffset: () => number

  // Read methods
  incrementReadOffset: (amount: number) => number
  readBuffer: () => Uint8Array
  readFloat32: () => number
  readFloat64: () => number
  readInt8: () => number
  readInt16: () => number
  readInt32: () => number
  readInt64: () => bigint | number
  readUint8: () => number
  readUint16: () => number
  readUint32: () => number
  readUint64: () => bigint | number

  // Write methods

  /**
   * Increment offset
   * @param amount - how many bytes
   * @returns The offset when this reserving starts.
   */
  incrementWriteOffset: (amount: number) => number

  writeBuffer: (value: Uint8Array, writeLength?: boolean) => void
  writeFloat32: (value: number) => void
  writeFloat64: (value: number) => void
  writeInt8: (value: number) => void
  writeInt16: (value: number) => void
  writeInt32: (value: number) => void
  writeInt64: (value: bigint | number) => void
  writeUint8: (value: number) => void
  writeUint16: (value: number) => void
  writeUint32: (value: number) => void
  writeUint64: (value: bigint | number) => void
}

export interface CreateByteBufferOptions {
  reading?: {
    buffer: Uint8Array
    length?: number
    currentOffset: number
  }
  writing?: {
    buffer: Uint8Array
    currentOffset?: number
  }
  initialCapacity?: number
}

const defaultInitialCapacity = 10240

export function createByteBuffer(
  options: CreateByteBufferOptions = {}
): ByteBuffer {
  const { writing, reading } = options
  let buffer =
    writing?.buffer ||
    reading?.buffer ||
    new Uint8Array(options.initialCapacity || defaultInitialCapacity)
  let view: DataView = new DataView(buffer.buffer)

  let woffset: number =
    writing?.currentOffset || reading?.length || reading?.buffer.length || 0
  let roffset: number = reading?.currentOffset || 0

  /**
   * Increement the write offset and resize the buffer if it needs.
   */
  const woAdd = (amount: number) => {
    if (woffset + amount > buffer.byteLength) {
      const newsize = getNextSize(buffer.byteLength, woffset + amount)
      const newBuffer = new Uint8Array(newsize)
      newBuffer.set(buffer)
      buffer = newBuffer
      view = new DataView(buffer.buffer)
    }

    woffset += amount
    return woffset - amount
  }

  /**
   * Increment the read offset and throw an error if it's trying to read
   *  outside the bounds.
   */
  const roAdd = (amount: number) => {
    if (roffset + amount > woffset) {
      throw new Error('Outside of the bounds of writen data.')
    }

    roffset += amount
    return roffset - amount
  }

  return {
    // General purpose
    view(): DataView {
      return view
    },

    buffer() {
      return buffer
    },

    bufferLength() {
      return buffer.length
    },

    /**
     * Reading purpose
     */

    incrementReadOffset(amount: number): number {
      return roAdd(amount)
    },

    currentReadOffset(): number {
      return roffset
    },

    remainingBytes(): number {
      return woffset - roffset
    },

    readFloat32(): number {
      return view.getFloat32(roAdd(4))
    },

    readFloat64(): number {
      return view.getFloat64(roAdd(8))
    },

    readInt8(): number {
      return view.getInt8(roAdd(1))
    },

    readInt16(): number {
      return view.getInt16(roAdd(2))
    },

    readInt32(): number {
      return view.getInt32(roAdd(4))
    },

    readInt64(): bigint | number {
      return view.getBigInt64(roAdd(8))
    },

    readUint8(): number {
      return view.getUint8(roAdd(1))
    },

    readUint16(): number {
      return view.getUint16(roAdd(2))
    },

    readUint32(): number {
      return view.getUint32(roAdd(4))
    },

    readUint64(): bigint | number {
      return view.getBigUint64(roAdd(8))
    },

    readBuffer() {
      const length = view.getUint32(roAdd(4))
      return buffer.subarray(roAdd(length), roAdd(0))
    },

    /**
     * Writing purpose
     */

    incrementWriteOffset(amount: number): number {
      return woAdd(amount)
    },

    size(): number {
      return woffset
    },

    toBinary() {
      return buffer.subarray(0, woffset)
    },

    writeBuffer(value: Uint8Array, writeLength: boolean = true) {
      if (writeLength) {
        this.writeUint32(value.byteLength)
      }

      const o = woAdd(value.buffer.byteLength)
      buffer.set(value, o)
    },

    writeFloat32(value: number): void {
      const o = woAdd(4)
      view.setFloat32(o, value)
    },

    writeFloat64(value: number): void {
      const o = woAdd(8)
      view.setFloat64(o, value)
    },

    writeInt8(value: number): void {
      const o = woAdd(1)
      view.setInt8(o, value)
    },

    writeInt16(value: number): void {
      const o = woAdd(2)
      view.setInt16(o, value)
    },

    writeInt32(value: number): void {
      const o = woAdd(4)
      view.setInt32(o, value)
    },

    writeInt64(value: bigint | number): void {
      const o = woAdd(8)
      view.setBigInt64(o, BigInt(value))
    },

    writeUint8(value: number): void {
      const o = woAdd(1)
      view.setUint8(o, value)
    },

    writeUint16(value: number): void {
      const o = woAdd(2)
      view.setUint16(o, value)
    },

    writeUint32(value: number): void {
      const o = woAdd(4)
      view.setUint32(o, value)
    },

    writeUint64(value: bigint | number): void {
      const o = woAdd(8)
      view.setBigUint64(o, BigInt(value))
    }
  }
}
