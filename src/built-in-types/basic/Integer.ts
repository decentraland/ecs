
import { EcsType } from "../EcsType"

export const Int32: EcsType<number> = {
    serialize(value: number, builder: ByteBuffer): void {
        builder.writeInt32(value)
    },
    deserialize(reader: ByteBuffer): number {
        return reader.readInt32()
    }
}
