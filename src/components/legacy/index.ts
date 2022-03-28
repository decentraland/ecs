import { Engine } from '../../engine'
import { BoxShape as LegacyBoxShape } from './BoxShape'
import { Transform as LegacyTransform } from './Transform'
import { LEGACY_CLASS_ID as ID } from './types'

export function defineLegacyComponents({ defineComponent }: Engine) {
  return {
    Transform: defineComponent(ID.TRANSFORM, LegacyTransform),
    BoxShape: defineComponent(ID.BOX_SHAPE, LegacyBoxShape)
  }
}
