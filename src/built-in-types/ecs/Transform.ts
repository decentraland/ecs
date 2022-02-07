
import { Parser } from "../../serialization/Parser"
import { Serializer } from "../../serialization/Serializer"
import { EcsType } from "../EcsType"

type Vector3 = { x: number, y: number, z: number }
type Quaternion = { x: number, y: number, z: number, w: number }
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
        const position = { x: reader.bb.readFloat32(), y: reader.bb.readFloat32(), z: reader.bb.readFloat32() }
        const rotation = { x: reader.bb.readFloat32(), y: reader.bb.readFloat32(), z: reader.bb.readFloat32(), w: reader.bb.readFloat32() }
        const scale = { x: reader.bb.readFloat32(), y: reader.bb.readFloat32(), z: reader.bb.readFloat32() }
        return { position, rotation, scale }
    }
}