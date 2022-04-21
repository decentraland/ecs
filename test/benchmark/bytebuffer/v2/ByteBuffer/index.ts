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

type ByteBufferData = {
  buffer: Uint8Array
  view: DataView

  woffset: number
  roffset: number
}

export function createByteBuffer(
  options: CreateByteBufferOptions = {}
): ByteBufferData {
  const { writing, reading } = options
  const buffer =
    writing?.buffer ||
    reading?.buffer ||
    new Uint8Array(options.initialCapacity || defaultInitialCapacity)
  const view: DataView = new DataView(buffer.buffer)

  const woffset: number =
    writing?.currentOffset || reading?.length || reading?.buffer.length || 0
  const roffset: number = reading?.currentOffset || 0

  return {
    buffer,
    view,
    woffset,
    roffset
  }
}

export namespace ByteBuffer {
  /**
   * Increement the write offset and resize the buffer if it needs.
   */
  export function woAdd(bbd: ByteBufferData, amount: number): number {
    if (bbd.woffset + amount > bbd.buffer.byteLength) {
      const newsize = getNextSize(bbd.buffer.byteLength, bbd.woffset + amount)
      const newBuffer = new Uint8Array(newsize)
      newBuffer.set(bbd.buffer)
      bbd.buffer = newBuffer
      bbd.view = new DataView(bbd.buffer.buffer)
    }

    bbd.woffset += amount
    return bbd.woffset - amount
  }

  /**
   * Increment the read offset and throw an error if it's trying to read
   *  outside the bounds.
   */
  export function roAdd(bbd: ByteBufferData, amount: number): number {
    if (bbd.roffset + amount > bbd.woffset) {
      throw new Error('Outside of the bounds of writen data.')
    }

    bbd.roffset += amount
    return bbd.roffset - amount
  }

  /**
   * Reading purpose
   * Returns the previuos offsset size before incrementing
   */
  export function incrementReadOffset(
    bbd: ByteBufferData,
    amount: number
  ): number {
    return roAdd(bbd, amount)
  }

  export function currentReadOffset(bbd: ByteBufferData): number {
    return bbd.roffset
  }

  export function remainingBytes(bbd: ByteBufferData): number {
    return bbd.woffset - bbd.roffset
  }

  export function readFloat32(bbd: ByteBufferData): number {
    return bbd.view.getFloat32(roAdd(bbd, 4))
  }

  export function readFloat64(bbd: ByteBufferData): number {
    return bbd.view.getFloat64(roAdd(bbd, 8))
  }

  export function readInt8(bbd: ByteBufferData): number {
    return bbd.view.getInt8(roAdd(bbd, 1))
  }

  export function readInt16(bbd: ByteBufferData): number {
    return bbd.view.getInt16(roAdd(bbd, 2))
  }

  export function readInt32(bbd: ByteBufferData): number {
    return bbd.view.getInt32(roAdd(bbd, 4))
  }

  export function readInt64(bbd: ByteBufferData): bigint {
    return bbd.view.getBigInt64(roAdd(bbd, 8))
  }

  export function readUint8(bbd: ByteBufferData): number {
    return bbd.view.getUint8(roAdd(bbd, 1))
  }

  export function readUint16(bbd: ByteBufferData): number {
    return bbd.view.getUint16(roAdd(bbd, 2))
  }

  export function readUint32(bbd: ByteBufferData): number {
    return bbd.view.getUint32(roAdd(bbd, 4))
  }

  export function readUint64(bbd: ByteBufferData): bigint {
    return bbd.view.getBigUint64(roAdd(bbd, 8))
  }

  export function readBuffer(bbd: ByteBufferData) {
    const length = bbd.view.getUint32(roAdd(bbd, 4))
    return bbd.buffer.subarray(roAdd(bbd, length), roAdd(bbd, 0))
  }

  /**
   * Writing purpose
   */

  export function incrementWriteOffset(
    bbd: ByteBufferData,
    amount: number
  ): number {
    return woAdd(bbd, amount)
  }

  export function size(bbd: ByteBufferData): number {
    return bbd.woffset
  }

  export function toBinary(bbd: ByteBufferData) {
    return bbd.buffer.subarray(0, bbd.woffset)
  }

  export function writeBuffer(
    bbd: ByteBufferData,
    value: Uint8Array,
    writeLength: boolean = true
  ) {
    if (writeLength) {
      this.writeUint32(value.byteLength)
    }

    const o = woAdd(bbd, value.buffer.byteLength)
    bbd.buffer.set(value, o)
  }

  export function writeFloat32(bbd: ByteBufferData, value: number): void {
    const o = woAdd(bbd, 4)
    bbd.view.setFloat32(o, value)
  }

  export function writeFloat64(bbd: ByteBufferData, value: number): void {
    const o = woAdd(bbd, 8)
    bbd.view.setFloat64(o, value)
  }

  export function writeInt8(bbd: ByteBufferData, value: number): void {
    const o = woAdd(bbd, 1)
    bbd.view.setInt8(o, value)
  }

  export function writeInt16(bbd: ByteBufferData, value: number): void {
    const o = woAdd(bbd, 2)
    bbd.view.setInt16(o, value)
  }

  export function writeInt32(bbd: ByteBufferData, value: number): void {
    const o = woAdd(bbd, 4)
    bbd.view.setInt32(o, value)
  }

  export function writeInt64(bbd: ByteBufferData, value: bigint): void {
    const o = woAdd(bbd, 8)
    bbd.view.setBigInt64(o, value)
  }

  export function writeUint8(bbd: ByteBufferData, value: number): void {
    const o = woAdd(bbd, 1)
    bbd.view.setUint8(o, value)
  }

  export function writeUint16(bbd: ByteBufferData, value: number): void {
    const o = woAdd(bbd, 2)
    bbd.view.setUint16(o, value)
  }

  export function writeUint32(bbd: ByteBufferData, value: number): void {
    const o = woAdd(bbd, 4)
    bbd.view.setUint32(o, value)
  }

  export function writeUint64(bbd: ByteBufferData, value: bigint): void {
    const o = woAdd(bbd, 8)
    bbd.view.setBigUint64(o, value)
  }
}
