import { Parser } from '../serialization/Parser'
import { Serializer } from '../serialization/Serializer'
import { EcsType } from '../built-in-types/EcsType'

type Sync = void

export const Sync: EcsType<Sync> = {
  serialize(_value: Sync, _builder: Serializer): void {
    return
  },
  deserialize(_reader: Parser): Sync {
    return
  }
}
