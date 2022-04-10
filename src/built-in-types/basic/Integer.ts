import { ByteBuffer } from '../../serialization/ByteBuffer'
import { EcsType } from '../EcsType'

export const Int64: EcsType<bigint> = {
  serialize(value: bigint, builder: ByteBuffer): void {
    builder.writeInt64(value)
  },
  deserialize(reader: ByteBuffer): bigint {
    return BigInt(reader.readInt64())
  }
}

export const Int32: EcsType<number> = {
  serialize(value: number, builder: ByteBuffer): void {
    builder.writeInt32(value)
  },
  deserialize(reader: ByteBuffer): number {
    return reader.readInt32()
  }
}

export const Int16: EcsType<number> = {
  serialize(value: number, builder: ByteBuffer): void {
    builder.writeInt16(value)
  },
  deserialize(reader: ByteBuffer): number {
    return reader.readInt16()
  }
}

export const Int8: EcsType<number> = {
  serialize(value: number, builder: ByteBuffer): void {
    builder.writeInt8(value)
  },
  deserialize(reader: ByteBuffer): number {
    return reader.readInt8()
  }
}
