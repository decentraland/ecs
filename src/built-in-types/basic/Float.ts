
import { Parser } from "../../serialization/Parser"
import { Serializer } from "../../serialization/Serializer"
import { EcsType } from "../EcsType"

export const Float: EcsType<number> = {
    serialize(value: number, builder: Serializer): void {
        builder.bb.writeFloat32(value)
    },
    deserialize(reader: Parser): number {
        return reader.bb.readFloat32()
    }
}