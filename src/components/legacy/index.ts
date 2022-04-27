import { Engine } from '../../engine'
import { defineProtocolBufferComponents } from '../generated'
import { Transform as LegacyTransform } from './Transform'
import { LEGACY_CLASS_ID as ID } from './types'

export function defineLegacyComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {
  return {
    Transform: defineComponent(ID.TRANSFORM, LegacyTransform),
    ...defineProtocolBufferComponents({ defineComponent })
  }
}
