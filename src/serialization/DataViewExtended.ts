export interface DataViewExtended {
  view: DataView
  buffer: () => Uint8Array
  offset: () => number
  poffset: (amount: number) => number
  binary: () => Uint8Array
  reset: () => void
}

export type DataViewExtendedCreationOptions = {
  initialCapacity?: number
  buffer?: Uint8Array
  initialOffset?: number
}

const defaultInitialCapacity = 10240

export function createDataViewExtended(
  options: DataViewExtendedCreationOptions = {}
): DataViewExtended {
  let buffer =
    options.buffer ||
    new Uint8Array(options.initialCapacity || defaultInitialCapacity)
  let offset: number = options.initialOffset || 0
  return {
    buffer: () => {
      return buffer
    },
    view: new DataView(buffer.buffer),
    offset: () => {
      return offset
    },

    // Return current offset and plus amount
    poffset: (amount: number) => {
      if (offset + amount > buffer.byteLength) {
        const newsize = getNextSize(buffer.byteLength, offset + amount)
        const newBuffer = new Uint8Array(newsize)
        newBuffer.set(buffer)
        buffer = newBuffer
      }

      offset += amount
      return offset - amount
    },
    binary: () => {
      return buffer.subarray(0, offset)
    },
    reset: () => {
      const newBuffer = new Uint8Array(buffer.byteLength)
      buffer = newBuffer
      offset = 0
    }
  }
}

function getNextSize(currentSize: number, intendedSize: number) {
  const minNewSize = Math.max(currentSize, intendedSize) + 1024
  return Math.ceil(minNewSize / 1024) * 1024 + 1024
}
