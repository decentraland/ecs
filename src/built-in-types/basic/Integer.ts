import { Parser } from '../../serialization/Parser'
import { Serializer } from '../../serialization/Serializer'
import { EcsType } from '../EcsType'

export const Int64: EcsType<bigint> = {
  serialize(value: bigint, builder: Serializer): void {
    builder.bb.writeUint64(value)
  },
  deserialize(reader: Parser): bigint {
    return BigInt(reader.bb.readUint64())
  }
}

export const Int32: EcsType<number> = {
  serialize(value: number, builder: Serializer): void {
    builder.bb.writeInt32(value)
  },
  deserialize(reader: Parser): number {
    return reader.bb.readInt32()
  }
}

export const Int16: EcsType<number> = {
  serialize(value: number, builder: Serializer): void {
    builder.bb.writeInt16(value)
  },
  deserialize(reader: Parser): number {
    return reader.bb.readInt16()
  }
}

export const Int8: EcsType<number> = {
  serialize(value: number, builder: Serializer): void {
    builder.bb.writeInt8(value)
  },
  deserialize(reader: Parser): number {
    return reader.bb.readInt8()
  }
}
