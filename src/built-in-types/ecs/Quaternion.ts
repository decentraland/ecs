
import { EcsType } from "../EcsType"

type Quaternion = { x: number, y: number, z: number, w: number }

export const Quaternion: EcsType<Quaternion> = {
    serialize(value: Quaternion, builder: ByteBuffer): void {
        builder.writeFloat32(value.x)
        builder.writeFloat32(value.y)
        builder.writeFloat32(value.z)
        builder.writeFloat32(value.w)
    },
    deserialize(reader: ByteBuffer): Quaternion {
        return {
            x: reader.readFloat32(),
            y: reader.readFloat32(),
            z: reader.readFloat32(),
            w: reader.readFloat32()
        }
    }
}