import { createByteBuffer } from '../src/serialization/ByteBuffer'

describe('ByteBuffer tests', () => {
  it('test all types', () => {
    const buf = createByteBuffer()

    buf.writeInt8(0xff)
    buf.writeInt16(0xffff)
    buf.writeInt32(0xffffffff)
    buf.writeInt64(0xffffffffffffffffn)
    buf.writeUint8(0xff)
    buf.writeUint16(0xffff)
    buf.writeUint32(0xffffffff)
    buf.writeUint64(0xffffffffffffffffn)
    buf.writeFloat32(Math.PI)
    buf.writeFloat64(Math.PI)
    buf.writeBuffer(new Uint8Array([27, 43, 97, 31]))

    expect(buf.size()).toBe(50)

    expect(buf.readInt8()).toBe(-1)
    expect(buf.readInt16()).toBe(-1)
    expect(buf.readInt32()).toBe(-1)
    expect(buf.readInt64()).toBe(-1n)

    expect(buf.remainingBytes()).toBe(50 - 15)
    expect(buf.currentReadOffset()).toBe(15)

    expect(buf.readUint8()).toBe(255)
    expect(buf.readUint16()).toBe(65535)
    expect(buf.readUint32()).toBe(4294967295)
    expect(buf.readUint64()).toBe(18446744073709551615n)
    expect(buf.readFloat32()).toBeCloseTo(Math.PI)
    expect(buf.readFloat64()).toBe(Math.PI)
    expect(buf.readBuffer().toString()).toEqual([27, 43, 97, 31].toString())
  })

  it('bounds conditions', () => {
    const buf = createByteBuffer({
      reading: {
        buffer: new Uint8Array([1, 2]),
        currentOffset: 2
      }
    })

    expect(() => {
      buf.readInt8()
    }).toThrowError('Outside of the bounds of writen data.')

    expect(buf.size()).toBe(2)
    buf.writeInt8(100)

    expect(buf.size()).toBeGreaterThan(2)
    expect(buf.bufferLength()).toBeGreaterThan(20)

    expect(buf.readUint8()).toBe(100)
  })

  it('write options and endianess', () => {
    const buf = createByteBuffer({
      writing: {
        buffer: new Uint8Array([0, 200, 0, 200]),
        currentOffset: 2
      }
    })

    expect(buf.size()).toBe(2)

    buf.writeUint16(0xffff)

    expect(buf.size()).toBe(4)
    expect(buf.bufferLength()).toBe(4)
    expect(buf.toBinary().toString()).toBe([0, 200, 255, 255].toString())
  })
})
