import * as BoxShape from './BoxShape'
import type { Engine } from '../../engine/types'

export function defineProtocolBufferComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {
  return {
    BoxShape: defineComponent(BoxShape.COMPONENT_ID, BoxShape.BoxShape)
  }
}
