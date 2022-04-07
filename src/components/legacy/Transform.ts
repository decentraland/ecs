import { Quaternion, Vector3 } from '@dcl/ecs-math/dist/next'
import { Parser } from '../../serialization/Parser'
import { Serializer } from '../../serialization/Serializer'
import { EcsType } from '../../built-in-types/EcsType'

type Transform = {
  position: Vector3.MutableVector3
  rotation: Quaternion.MutableQuaternion
  scale: Vector3.MutableVector3
}
// This transform can be optimized with Float32Array for example
export const Transform: EcsType<Transform> = {
  serialize(value: Transform, builder: Serializer): void {
    builder.dataView.view.setFloat32(
      builder.dataView.poffset(4),
      value.position.x
    )
    builder.dataView.view.setFloat32(
      builder.dataView.poffset(4),
      value.position.y
    )
    builder.dataView.view.setFloat32(
      builder.dataView.poffset(4),
      value.position.z
    )
    builder.dataView.view.setFloat32(
      builder.dataView.poffset(4),
      value.rotation.x
    )
    builder.dataView.view.setFloat32(
      builder.dataView.poffset(4),
      value.rotation.y
    )
    builder.dataView.view.setFloat32(
      builder.dataView.poffset(4),
      value.rotation.z
    )
    builder.dataView.view.setFloat32(
      builder.dataView.poffset(4),
      value.rotation.w
    )
    builder.dataView.view.setFloat32(builder.dataView.poffset(4), value.scale.x)
    builder.dataView.view.setFloat32(builder.dataView.poffset(4), value.scale.y)
    builder.dataView.view.setFloat32(builder.dataView.poffset(4), value.scale.z)
  },
  deserialize(reader: Parser): Transform {
    return {
      position: Vector3.create(
        reader.dataView.view.getFloat32(reader.dataView.poffset(4)),
        reader.dataView.view.getFloat32(reader.dataView.poffset(4)),
        reader.dataView.view.getFloat32(reader.dataView.poffset(4))
      ),
      rotation: Quaternion.create(
        reader.dataView.view.getFloat32(reader.dataView.poffset(4)),
        reader.dataView.view.getFloat32(reader.dataView.poffset(4)),
        reader.dataView.view.getFloat32(reader.dataView.poffset(4)),
        reader.dataView.view.getFloat32(reader.dataView.poffset(4))
      ),
      scale: Vector3.create(
        reader.dataView.view.getFloat32(reader.dataView.poffset(4)),
        reader.dataView.view.getFloat32(reader.dataView.poffset(4)),
        reader.dataView.view.getFloat32(reader.dataView.poffset(4))
      )
    }
  }
}
