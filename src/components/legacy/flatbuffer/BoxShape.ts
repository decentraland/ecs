import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../../../built-in-types/EcsType'
import { ByteBuffer } from '../../../serialization/ByteBuffer'
import { BoxShape as fbBoxShape, BoxShapeT } from './fb-generated/box-shape'

export const CLASS_ID = 16

type Type = number | boolean

type FromClass<T> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K]
    : T[K] extends Type
    ? T[K]
    : never
}

type BoxShape = FromClass<BoxShapeT>

export const BoxShape: EcsType<BoxShape> = {
  serialize(value: BoxShape, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    fbBuilder.finish(BoxShapeT.pack(fbBuilder, value))
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): BoxShape {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    // TODO: see performance
    return { ...fbBoxShape.getRootAsBoxShape(buf).unpack() }
  }
}
