import { Parser } from '../../serialization/Parser'
import { Serializer } from '../../serialization/Serializer'
import { EcsType } from '../EcsType'

export const Int64: EcsType<bigint> = {
  serialize(value: bigint, builder: Serializer): void {
    builder.dataView.view.setBigInt64(builder.dataView.poffset(8), value)
  },
  deserialize(reader: Parser): bigint {
    return reader.dataView.view.getBigInt64(reader.dataView.poffset(8))
  }
}

export const Int32: EcsType<number> = {
  serialize(value: number, builder: Serializer): void {
    builder.dataView.view.setInt32(builder.dataView.poffset(4), value)
  },
  deserialize(reader: Parser): number {
    return reader.dataView.view.getInt32(reader.dataView.poffset(4))
  }
}

export const Int16: EcsType<number> = {
  serialize(value: number, builder: Serializer): void {
    builder.dataView.view.setInt16(builder.dataView.poffset(2), value)
  },
  deserialize(reader: Parser): number {
    return reader.dataView.view.getInt16(reader.dataView.poffset(2))
  }
}

export const Int8: EcsType<number> = {
  serialize(value: number, builder: Serializer): void {
    builder.dataView.view.setInt8(builder.dataView.poffset(8), value)
  },
  deserialize(reader: Parser): number {
    return reader.dataView.view.getInt8(reader.dataView.poffset(8))
  }
}
