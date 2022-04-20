import * as BoxShape from './BoxShape'
import * as CircleShape from './CircleShape'
import * as FBTransform from './FBTransform'
import * as PlaneShape from './PlaneShape'
import * as SphereShape from './SphereShape'
import { Engine } from '../../../engine'

export function defineFlatbufferComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {
  return {
    BoxShape: defineComponent(BoxShape.COMPONENT_ID, BoxShape.BoxShape),
    CircleShape: defineComponent(
      CircleShape.COMPONENT_ID,
      CircleShape.CircleShape
    ),
    FBTransform: defineComponent(
      FBTransform.COMPONENT_ID,
      FBTransform.FBTransform
    ),
    PlaneShape: defineComponent(PlaneShape.COMPONENT_ID, PlaneShape.PlaneShape),
    SphereShape: defineComponent(
      SphereShape.COMPONENT_ID,
      SphereShape.SphereShape
    )
  }
}
