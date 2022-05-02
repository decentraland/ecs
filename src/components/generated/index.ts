import * as BoxShape from './BoxShape'
import { Engine } from '../../engine/index'

export function defineProtocolBufferComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {
  return {
    BoxShape: defineComponent(BoxShape.COMPONENT_ID, BoxShape.BoxShape)
  }
}
