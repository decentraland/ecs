import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../../../built-in-types/EcsType'
import { ByteBuffer } from '../../../serialization/ByteBuffer'
import {
  PlaneShape as fbPlaneShape,
  PlaneShapeT
} from './fb-generated/plane-shape'

export const COMPONENT_ID = 18

type Type = number | boolean

type FromClass<T> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K]
    : T[K] extends Type
    ? T[K]
    : never
}

type PlaneShape = FromClass<PlaneShapeT>

export const PlaneShape: EcsType<PlaneShape> = {
  serialize(value: PlaneShape, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    fbBuilder.finish(PlaneShapeT.pack(fbBuilder, value))
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): PlaneShape {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    // TODO: see performance
    return { ...fbPlaneShape.getRootAsPlaneShape(buf).unpack() }
  }
}
