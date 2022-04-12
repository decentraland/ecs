import { EcsType } from '../../../built-in-types/EcsType'
import { BaseShape } from './../Shape'
import { BoxShape as fbBoxShape } from './box-shape'
import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { ByteBuffer } from '../../../serialization/ByteBuffer'

type BoxShape = BaseShape & {
  uvs: number[]
}

export const BoxShape: EcsType<BoxShape> = {
  serialize(value: BoxShape, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    const boxShape = fbBoxShape.createBoxShape(
      fbBuilder,
      value.withCollisions,
      value.isPointerBlocker,
      value.visible,
      fbBoxShape.createUvsVector(fbBuilder, value.uvs)
    )
    fbBuilder.finish(boxShape)

    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): BoxShape {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    const boxShape = fbBoxShape.getRootAsBoxShape(buf)

    const newValue: BoxShape = {
      visible: boxShape.visible(),
      isPointerBlocker: boxShape.visible(),
      withCollisions: boxShape.visible(),
      uvs: Array.from(
        { length: boxShape.uvsLength() },
        (_v, k) => boxShape.uvs(k) || 0
      )
    }
    return newValue
  }
}
