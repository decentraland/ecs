
import { Quaternion, Vector3 } from "@dcl/ecs-math"
import { Parser } from "../serialization/Parser"
import { Serializer } from "../serialization/Serializer"
import { EcsType } from "../built-in-types/EcsType"

type Transform = {
  position: Vector3,
  rotation: Quaternion,
  scale: Vector3
}

// This transform can be optimized with Float32Array for example
export const Transform: EcsType<Transform> = {
  serialize(value: Transform, builder: Serializer): void {
    builder.bb.writeFloat32(value.position.x)
    builder.bb.writeFloat32(value.position.y)
    builder.bb.writeFloat32(value.position.z)
    builder.bb.writeFloat32(value.rotation.x)
    builder.bb.writeFloat32(value.rotation.y)
    builder.bb.writeFloat32(value.rotation.z)
    builder.bb.writeFloat32(value.rotation.w)
    builder.bb.writeFloat32(value.scale.x)
    builder.bb.writeFloat32(value.scale.y)
    builder.bb.writeFloat32(value.scale.z)
  },
  deserialize(reader: Parser): Transform {
    return {
      position: new Vector3(reader.bb.readFloat32(), reader.bb.readFloat32(), reader.bb.readFloat32()),
      rotation: new Quaternion(reader.bb.readFloat32(), reader.bb.readFloat32(), reader.bb.readFloat32(), reader.bb.readFloat32()),
      scale: new Vector3(reader.bb.readFloat32(), reader.bb.readFloat32(), reader.bb.readFloat32())
    }
  }
}