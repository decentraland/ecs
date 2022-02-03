import { Builder } from "flatbuffers/js/flexbuffers/builder"
import { Reference } from "flatbuffers/js/flexbuffers/reference"
import { EcsType } from "../EcsType"

type Quaternion = { x: number, y: number, z: number, w: number }

export const Quaternion: EcsType<Quaternion> = {
    serialize(value: Quaternion, builder: Builder): void {
        builder.addFloat(value.x)
        builder.addFloat(value.y)
        builder.addFloat(value.z)
        builder.addFloat(value.w)
    },
    deserialize(reader: Reference): Quaternion {
        return {
            x: reader.floatValue()!,
            y: reader.floatValue()!,
            z: reader.floatValue()!,
            w: reader.floatValue()!
        }
    }
}