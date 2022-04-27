import * as BoxShape from './BoxShape'
import { Engine } from '../../engine'

export function defineFlatbufferComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {
  return {
    BoxShape: defineComponent(BoxShape.COMPONENT_ID, BoxShape.BoxShape)
  }
}
