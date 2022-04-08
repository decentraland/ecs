const defaultInitialCapacity = 10240

function getNextSize(currentSize: number, intendedSize: number) {
  const minNewSize = Math.max(currentSize, intendedSize) + 1024
  return Math.ceil(minNewSize / 1024) * 1024 + 1024
}

export interface ByteBuffer {
  offset: () => number
  view: () => DataView
  reserve: (amount: number) => number

  toBinary: () => Uint8Array
  buffer: () => Uint8Array

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
  readBuffer: () => Uint8Array

  writeBuffer: (value: Uint8Array) => void
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

export function createByteBuffer(customBuffer?: Uint8Array): ByteBuffer {
  let buffer = customBuffer || new Uint8Array(defaultInitialCapacity)
  let view: DataView = new DataView(buffer.buffer)
  let offset: number = 0

  const poffset = (amount: number) => {
    if (offset + amount > buffer.byteLength) {
      const newsize = getNextSize(buffer.byteLength, offset + amount)
      const newBuffer = new Uint8Array(newsize)
      newBuffer.set(buffer)
      buffer = newBuffer
      view = new DataView(buffer.buffer)
    }

    offset += amount
    return offset - amount
  }

  return {
    offset(): number {
      return offset
    },
    view(): DataView {
      return view
    },
    reserve(amount: number): number {
      return poffset(amount)
    },
    buffer() {
      return buffer
    },
    toBinary() {
      return buffer.subarray(0, offset)
    },

    readFloat32(): number {
      return view.getFloat32(poffset(4))
    },

    readFloat64(): number {
      return view.getFloat64(poffset(8))
    },

    readInt8(): number {
      return view.getInt8(poffset(1))
    },

    readInt16(): number {
      return view.getInt16(poffset(2))
    },

    readInt32(): number {
      return view.getInt32(poffset(4))
    },

    readInt64(): bigint | number {
      return view.getBigInt64(poffset(8))
    },

    readUint8(): number {
      return view.getUint8(poffset(1))
    },

    readUint16(): number {
      return view.getUint16(poffset(2))
    },

    readUint32(): number {
      return view.getUint32(poffset(4))
    },

    readUint64(): bigint | number {
      return view.getBigUint64(poffset(8))
    },

    readBuffer() {
      const length = view.getUint32(poffset(4))
      return buffer.subarray(poffset(length), poffset(0))
    },

    writeBuffer(value: Uint8Array) {
      view.setUint32(poffset(4), value.byteLength)
      buffer.set(value, poffset(value.byteLength))
    },

    writeFloat32(value: number): void {
      view.setFloat32(poffset(4), value)
    },

    writeFloat64(value: number): void {
      view.setFloat64(poffset(8), value)
    },

    writeInt8(value: number): void {
      view.setInt8(poffset(1), value)
    },

    writeInt16(value: number): void {
      view.setInt16(poffset(2), value)
    },

    writeInt32(value: number): void {
      view.setInt32(poffset(4), value)
    },

    writeInt64(value: bigint | number): void {
      view.setBigInt64(poffset(8), BigInt(value))
    },

    writeUint8(value: number): void {
      view.setUint8(poffset(1), value)
    },

    writeUint16(value: number): void {
      view.setUint16(poffset(2), value)
    },

    writeUint32(value: number): void {
      view.setUint32(poffset(4), value)
    },

    writeUint64(value: bigint | number): void {
      view.setBigUint64(poffset(8), BigInt(value))
    }
  }
}
