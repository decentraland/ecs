import { Builder } from "flatbuffers/js/flexbuffers/builder"
import { Reference } from "flatbuffers/js/flexbuffers/reference"
import { EcsType } from "../EcsType"

export const String: EcsType<string> = {
    serialize(value: string, builder: Builder): void {
        builder.add(value)
    },
    deserialize(reader: Reference): string {
        return reader.stringValue()!
    }
}