import { Parser } from '../../serialization/Parser'
import { Serializer } from '../../serialization/Serializer'
import { EcsType } from '../EcsType'

export const Int64: EcsType<Long> = {
  serialize(value: Long, builder: Serializer): void {
    builder.bb.writeInt64(value)
  },
  deserialize(reader: Parser): Long {
    return reader.bb.readInt64()
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
