import { ByteBuffer } from '../serialization/ByteBuffer'

export type EcsType<T = any> = {
  serialize(value: T, builder: ByteBuffer): void
  deserialize(reader: ByteBuffer): T
}
