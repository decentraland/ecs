
import { Parser } from "../../serialization/Parser"
import { Serializer } from "../../serialization/Serializer"
import { EcsType } from "../EcsType"

export const Int32: EcsType<number> = {
    serialize(value: number, builder: Serializer): void {
        builder.bb.writeInt32(value)
    },
    deserialize(reader: Parser): number {
        return reader.bb.readInt32()
    }
}
