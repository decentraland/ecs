
import { Parser } from "../../serialization/Parser"
import { Serializer } from "../../serialization/Serializer"
import { EcsType } from "../EcsType"

export const String: EcsType<string> = {
    serialize(value: string, builder: Serializer): void {
        builder.bb.writeUint32(value.length)
        builder.bb.writeString(value)
        // const offset = builder.bb.offset
        // builder.bb.writeUint32(0)

        // builder.push(() => {
        //     builder.bb.writeUint32(builder.bb.offset, offset)
        //     builder.bb.writeString(value)
        // })
    },
    deserialize(reader: Parser): string {
        const length = reader.bb.readUint32()
        // const offset = reader.bb.readUint32()
        return reader.bb.readString(length)
    }
}