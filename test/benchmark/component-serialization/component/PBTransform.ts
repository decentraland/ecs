import { EcsType } from '../package/EcsType'
import { ByteBuffer } from '../package/ByteBuffer'

import { PBTransform as pbPBTransform } from '../pb-generated/PBTransform'

export const PBTransform: EcsType<pbPBTransform> = {
  serialize(value: pbPBTransform, builder: ByteBuffer): void {
    const writer = pbPBTransform.encode(value)
    const buffer = new Uint8Array(writer.finish(), 0, writer.len)
    builder.writeBuffer(buffer)
  },
  deserialize(reader: ByteBuffer): pbPBTransform {
    const buf = reader.readBuffer()
    return pbPBTransform.decode(buf, buf.length)
  }
}
