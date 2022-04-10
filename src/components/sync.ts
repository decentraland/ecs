
import { EcsType } from '../built-in-types/EcsType'
import { ByteBuffer } from '../serialization/ByteBuffer'

type Sync = void

export const Sync: EcsType<Sync> = {
  serialize(_value: Sync, _builder: ByteBuffer): void {
    return
  },
  deserialize(_reader: ByteBuffer): Sync {
    return
  }
}
