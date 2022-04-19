import { Engine } from '../../engine'
import { defineFlatbufferComponents } from './flatbuffer'
import { Transform as LegacyTransform } from './Transform'
import { LEGACY_CLASS_ID as ID } from './types'

export function defineLegacyComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {
  return {
    Transform: defineComponent(ID.TRANSFORM, LegacyTransform),
    ...defineFlatbufferComponents({ defineComponent })
  }
}
