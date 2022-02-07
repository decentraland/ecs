import { Builder } from "flatbuffers/js/flexbuffers/builder"
import { Reference } from "flatbuffers/js/flexbuffers/reference"
import { EcsType } from "../EcsType"

export const Float: EcsType<number> = {
    serialize(value: number, builder: Builder): void {
        builder.addFloat(value)
    },
    deserialize(reader: Reference): number {
        return reader.floatValue()!
    }
}