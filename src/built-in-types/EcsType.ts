import { Parser } from '../serialization/Parser'
import { Serializer } from './../serialization/Serializer'

export type EcsType<T = any> = {
  serialize(value: T, builder: Serializer): void
  deserialize(reader: Parser): T
}
