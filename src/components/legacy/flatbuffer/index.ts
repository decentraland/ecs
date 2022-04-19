import * as BoxShape from './BoxShape'
import * as CircleShape from './CircleShape'
import * as PlaneShape from './PlaneShape'
import * as SphereShape from './SphereShape'
import { Engine } from '../../../engine'

export function defineFlatbufferComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {
  return {
    BoxShape: defineComponent(BoxShape.CLASS_ID, BoxShape.BoxShape),
    CircleShape: defineComponent(CircleShape.CLASS_ID, CircleShape.CircleShape),
    PlaneShape: defineComponent(PlaneShape.CLASS_ID, PlaneShape.PlaneShape),
    SphereShape: defineComponent(SphereShape.CLASS_ID, SphereShape.SphereShape)
  }
}
