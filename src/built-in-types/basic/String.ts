
import { Parser } from "../../serialization/Parser"
import { Serializer } from "../../serialization/Serializer"
import { EcsType } from "../EcsType"

export const FlatString: EcsType<string> = {
    serialize(value: string, builder: Serializer): void {
        builder.bb.writeUint32(value.length)
        builder.bb.writeString(value)
    },
    deserialize(reader: Parser): string {
        const length = reader.bb.readUint32()
        return reader.bb.readString(length)
    }
}

export const IndirectString: EcsType<string> = {
    serialize(value: string, builder: Serializer): void {
        const offset = [builder.bb.offset]
        builder.bb.writeUint32(0)

        builder.push(() => {
            builder.bb.writeUint32(builder.bb.offset, offset[0])
            builder.bb.writeUint32(value.length)
            builder.bb.writeString(value)
        })
    },
    deserialize(reader: Parser): string {
        const offset = reader.bb.readUint32()
        const length = reader.bb.readUint32(offset)
        const value = reader.bb.readString(length, offset + 4) as any
        return value.string
    }
}

export const String = IndirectString