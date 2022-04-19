import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../../../built-in-types/EcsType'
import { ByteBuffer } from '../../../serialization/ByteBuffer'
import {
  CircleShape as fbCircleShape,
  CircleShapeT
} from './fb-generated/circle-shape'

export const COMPONENT_ID = 31

type Type = number | boolean

type FromClass<T> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K]
    : T[K] extends Type
    ? T[K]
    : never
}

type CircleShape = FromClass<CircleShapeT>

export const CircleShape: EcsType<CircleShape> = {
  serialize(value: CircleShape, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    fbBuilder.finish(CircleShapeT.pack(fbBuilder, value))
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): CircleShape {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    // TODO: see performance
    return { ...fbCircleShape.getRootAsCircleShape(buf).unpack() }
  }
}
