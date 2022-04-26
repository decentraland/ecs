import { EcsType } from '../../../built-in-types/EcsType'
import { ByteBuffer } from '../../../serialization/ByteBuffer'
import { PBBoxShape } from './BoxShape'

export const BoxShape: EcsType<PBBoxShape> = {
  serialize(value: PBBoxShape, builder: ByteBuffer): void {
    const writer = PBBoxShape.encode(value)
    const buffer = new Uint8Array(writer.finish(), 0, writer.len)

    builder.writeBuffer(buffer)
  },
  deserialize(reader: ByteBuffer): PBBoxShape {
    const buf = reader.readBuffer()
    return PBBoxShape.decode(buf, buf.length)
  }
}
