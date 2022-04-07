import { Parser } from '../../serialization/Parser'
import { Serializer } from '../../serialization/Serializer'
import { EcsType } from '../EcsType'

export const Float32: EcsType<number> = {
  serialize(value: number, builder: Serializer): void {
    builder.dataView.view.setFloat32(builder.dataView.poffset(4), value)
  },
  deserialize(reader: Parser): number {
    return reader.dataView.view.getFloat32(reader.dataView.poffset(4))
  }
}

export const Float64: EcsType<number> = {
  serialize(value: number, builder: Serializer): void {
    builder.dataView.view.setFloat64(builder.dataView.poffset(8), value)
  },
  deserialize(reader: Parser): number {
    return reader.dataView.view.getFloat64(reader.dataView.poffset(8))
  }
}
