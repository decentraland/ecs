import { Builder } from "flatbuffers/js/flexbuffers/builder"
import { Reference } from "flatbuffers/js/flexbuffers/reference"
import { EcsType } from "../EcsType"

type Vector3 = { x: number, y: number, z: number }

export const Vector3: EcsType<Vector3> = {
    serialize(value: Vector3, builder: Builder): void {
        builder.addFloat(value.x)
        builder.addFloat(value.y)
        builder.addFloat(value.z)
    },
    deserialize(reader: Reference): Vector3 {
        return {
            x: reader.floatValue()!,
            y: reader.floatValue()!,
            z: reader.floatValue()!
        }
    }
}