
import { Parser } from "../../serialization/Parser"
import { Serializer } from "../../serialization/Serializer"
import { EcsType } from "../EcsType"

type Quaternion = { x: number, y: number, z: number, w: number }

export const Quaternion: EcsType<Quaternion> = {
    serialize(value: Quaternion, builder: Serializer): void {
        builder.bb.writeFloat32(value.z)
        builder.bb.writeFloat32(value.x)
        builder.bb.writeFloat32(value.y)
        builder.bb.writeFloat32(value.w)
    },
    deserialize(reader: Parser): Quaternion {
        return {
            x: reader.bb.readFloat32(),
            y: reader.bb.readFloat32(),
            z: reader.bb.readFloat32(),
            w: reader.bb.readFloat32()
        }
    }
}