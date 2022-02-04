
import { EcsType } from "../EcsType"

type Vector3 = { x: number, y: number, z: number }

export const Vector3: EcsType<Vector3> = {
    serialize(value: Vector3, builder: ByteBuffer): void {
        builder.writeFloat32(value.x)
        builder.writeFloat32(value.y)
        builder.writeFloat32(value.z)
    },
    deserialize(reader: ByteBuffer): Vector3 {
        const x = reader.readFloat32()
        const y = reader.readFloat32()
        const z = reader.readFloat32()
        return { x, y, z }
    }
}