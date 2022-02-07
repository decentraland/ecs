
import { Parser } from "../../serialization/Parser"
import { Serializer } from "../../serialization/Serializer"
import { EcsType } from "../EcsType"

type Vector3 = { x: number, y: number, z: number }

export const Vector3: EcsType<Vector3> = {
    serialize(value: Vector3, builder: Serializer): void {
        builder.bb.writeFloat32(value.x)
        builder.bb.writeFloat32(value.y)
        builder.bb.writeFloat32(value.z)
    },
    deserialize(reader: Parser): Vector3 {
        const x = reader.bb.readFloat32()
        const y = reader.bb.readFloat32()
        const z = reader.bb.readFloat32()
        return { x, y, z }
    }
}