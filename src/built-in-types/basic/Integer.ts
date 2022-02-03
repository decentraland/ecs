import { Builder } from "flatbuffers/js/flexbuffers/builder"
import { Reference } from "flatbuffers/js/flexbuffers/reference"
import { EcsType } from "../EcsType"

export const Int32: EcsType<number> = {
    serialize(value: number, builder: Builder): void {
        builder.addInt(value)
    },
    deserialize(reader: Reference): number {
        return reader.numericValue()! as number
    }
}
