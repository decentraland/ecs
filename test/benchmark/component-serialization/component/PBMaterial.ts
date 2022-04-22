import { EcsType } from '../package/EcsType'
import { ByteBuffer } from '../package/ByteBuffer'

import { PBMaterial as pbPBMaterial } from '../pb-generated/FBMaterial'

export const PBMaterial: EcsType<pbPBMaterial> = {
  serialize(value: pbPBMaterial, builder: ByteBuffer): void {
    const writer = pbPBMaterial.encode(value)
    const buffer = new Uint8Array(writer.finish(), 0, writer.len)

    builder.writeBuffer(buffer, false)
  },
  deserialize(reader: ByteBuffer): pbPBMaterial {
    const length = reader.view().getUint32(reader.incrementReadOffset(0) - 4)
    return pbPBMaterial.decode(reader.buffer(), length)
  }
}
