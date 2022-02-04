
import { EcsType } from "../EcsType"

export const Float: EcsType<number> = {
    serialize(value: number, builder: ByteBuffer): void {
        builder.writeFloat32(value)
    },
    deserialize(reader: ByteBuffer): number {
        return reader.readFloat32()
    }
}