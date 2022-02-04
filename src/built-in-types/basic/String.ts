
import { EcsType } from "../EcsType"

export const String: EcsType<string> = {
    serialize(value: string, builder: ByteBuffer): void {
        builder.writeUint32(value.length)
        builder.writeString(value)
    },
    deserialize(reader: ByteBuffer): string {
        const length = reader.readUint32()
        return reader.readString(length)
    }
}