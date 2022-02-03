import { Builder } from 'flatbuffers/js/flexbuffers/builder'
import { Reference } from 'flatbuffers/js/flexbuffers/reference'

export type EcsType<T = any> = {
  serialize(value: T, builder: Builder): void,
  deserialize(reader: Reference): T
}