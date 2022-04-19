const file = `
import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../../../built-in-types/EcsType'
import { ByteBuffer } from '../../../serialization/ByteBuffer'
import { Component as fbComponent, ComponentT } from './fb-generated/component-ts-file'

export const COMPONENT_ID = INVALID_COMPONENT_ID

type Type = number | boolean

type FromClass<T> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K]
    : T[K] extends Type
    ? T[K]
    : never
}

type Component = FromClass<ComponentT>

export const Component: EcsType<Component> = {
  serialize(value: Component, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    fbBuilder.finish(ComponentT.pack(fbBuilder, value))
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): Component {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    // TODO: see performance
    return { ...fbComponent.getRootAsComponent(buf).unpack() }
  }
}
`
export default file
