import { Parser } from '../../../serialization/Parser'
import { Serializer } from '../../../serialization/Serializer'
import { EcsType } from '../../../built-in-types/EcsType'
import { BaseShape } from './../Shape'
import { BoxShape as fbBoxShape } from './box-shape'
import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'

type BoxShape = BaseShape & {
  uvs: number[]
}

export const BoxShape: EcsType<BoxShape> = {
  serialize(value: BoxShape, builder: Serializer): void {
    const fbBuilder = new Builder()

    const uvs = fbBoxShape.createUvsVector(fbBuilder, value.uvs)
    const boxShape = fbBoxShape.createBoxShape(
      fbBuilder,
      value.withCollisions,
      value.isPointerBlocker,
      value.visible,
      uvs
    )
    fbBuilder.finish(boxShape)
    const data = fbBuilder.asUint8Array()
    builder.bb.buffer().set(data, builder.bb.reserve(data.length))
  },
  deserialize(reader: Parser): BoxShape {
    const buf = new FlatBufferByteBuffer(reader.bb.buffer())
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
