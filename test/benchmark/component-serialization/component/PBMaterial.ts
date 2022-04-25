import { EcsType } from '../package/EcsType'
import { ByteBuffer } from '../package/ByteBuffer'

import { PBMaterial as pbPBMaterial } from '../pb-generated/PBMaterial'

export const PBMaterial: EcsType<pbPBMaterial> = {
  serialize(value: pbPBMaterial, builder: ByteBuffer): void {
    const writer = pbPBMaterial.encode(value)
    const buffer = new Uint8Array(writer.finish(), 0, writer.len)

    builder.writeBuffer(buffer)
  },
  deserialize(reader: ByteBuffer): pbPBMaterial {
    const buf = reader.readBuffer()
    return pbPBMaterial.decode(buf, buf.length)
  }
}
