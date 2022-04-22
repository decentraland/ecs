import { ByteBuffer } from '../ByteBuffer'
import { EcsType } from '../EcsType'

export const FlatString: EcsType<string> = {
  serialize(value: string, builder: ByteBuffer): void {
    builder.writeBuffer(new TextEncoder().encode(value))
  },
  deserialize(reader: ByteBuffer): string {
    return new TextDecoder().decode(reader.readBuffer())
  }
}

export const String = FlatString
