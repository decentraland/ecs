import { Parser } from '../../serialization/Parser'
import { Serializer } from '../../serialization/Serializer'
import { EcsType } from '../EcsType'

export const FlatString: EcsType<string> = {
  serialize(value: string, builder: Serializer): void {
    builder.bb.writeBuffer(new TextEncoder().encode(value))
  },
  deserialize(reader: Parser): string {
    return new TextDecoder().decode(reader.bb.readBuffer())
  }
}

export const String = FlatString
