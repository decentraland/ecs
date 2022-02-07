
import { Parser } from "../../serialization/Parser"
import { Serializer } from "../../serialization/Serializer"
import { EcsType } from "../EcsType"

const float32Array = new Float32Array([0.0])
const int32Array = new Int32Array(float32Array.buffer)

export const Float32: EcsType<number> = {
    serialize(value: number, builder: Serializer): void {
        builder.bb.writeFloat32(value)
    },
    deserialize(reader: Parser): number {
        return reader.bb.readFloat32()
    }
}

export const Float64: EcsType<number> = {
    serialize(value: number, builder: Serializer): void {
        builder.bb.writeFloat64(value)
    },
    deserialize(reader: Parser): number {
        return reader.bb.readFloat64()
    }
}