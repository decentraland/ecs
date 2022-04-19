import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../../../built-in-types/EcsType'
import { ByteBuffer } from '../../../serialization/ByteBuffer'
import {
  SphereShape as fbSphereShape,
  SphereShapeT
} from './fb-generated/sphere-shape'

export const CLASS_ID = 17

type Type = number | boolean

type FromClass<T> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K]
    : T[K] extends Type
    ? T[K]
    : never
}

type SphereShape = FromClass<SphereShapeT>

export const SphereShape: EcsType<SphereShape> = {
  serialize(value: SphereShape, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    fbBuilder.finish(SphereShapeT.pack(fbBuilder, value))
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): SphereShape {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    // TODO: see performance
    return { ...fbSphereShape.getRootAsSphereShape(buf).unpack() }
  }
}
