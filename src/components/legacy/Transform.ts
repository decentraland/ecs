import { Quaternion, Vector3 } from '@dcl/ecs-math'
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
    const view = builder.bb.view()
    const ptr = builder.bb.reserve(40)
    view.setFloat32(ptr, value.position.x)
    view.setFloat32(ptr + 4, value.position.y)
    view.setFloat32(ptr + 8, value.position.z)
    view.setFloat32(ptr + 12, value.rotation.x)
    view.setFloat32(ptr + 16, value.rotation.y)
    view.setFloat32(ptr + 20, value.rotation.z)
    view.setFloat32(ptr + 24, value.rotation.w)
    view.setFloat32(ptr + 28, value.scale.x)
    view.setFloat32(ptr + 32, value.scale.y)
    view.setFloat32(ptr + 36, value.scale.z)
  },
  deserialize(reader: Parser): Transform {
    const view = reader.bb.view()
    const ptr = reader.bb.reserve(40)
    return {
      position: Vector3.create(
        view.getFloat32(ptr),
        view.getFloat32(ptr + 4),
        view.getFloat32(ptr + 8)
      ),
      rotation: Quaternion.create(
        view.getFloat32(ptr + 12),
        view.getFloat32(ptr + 16),
        view.getFloat32(ptr + 20),
        view.getFloat32(ptr + 24)
      ),
      scale: Vector3.create(
        view.getFloat32(ptr + 28),
        view.getFloat32(ptr + 32),
        view.getFloat32(ptr + 36)
      )
    }
  }
}
