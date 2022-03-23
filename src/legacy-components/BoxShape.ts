import { Parser } from "../serialization/Parser"
import { Serializer } from "../serialization/Serializer"
import { EcsType } from "../built-in-types/EcsType"
import { BaseShape } from "./Shape"

type BoxShape = BaseShape & {
  uvs: number[]
}

export const BoxShape: EcsType<BoxShape> = {
  serialize(value: BoxShape, builder: Serializer): void {
    builder.bb.writeByte(value.visible ? 1 : 0)
    builder.bb.writeByte(value.isPointerBlocker ? 1 : 0)
    builder.bb.writeByte(value.withCollisions ? 1 : 0)

    builder.bb.writeUint16(value.uvs.length)
    for (let i = 0; i < value.uvs.length; i++) {
      builder.bb.writeFloat32(value.uvs[i])
    }
  },
  deserialize(reader: Parser): BoxShape {
    const newValue: BoxShape = {
      visible: reader.bb.readByte() === 1,
      isPointerBlocker: reader.bb.readByte() === 1,
      withCollisions: reader.bb.readByte() === 1,
      uvs: Array.from({ length: reader.bb.readUint16() }, () => reader.bb.readFloat32())
    }
    return newValue
  }
}