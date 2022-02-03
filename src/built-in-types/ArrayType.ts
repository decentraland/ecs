import { Builder } from "flatbuffers/js/flexbuffers/builder"
import { Reference } from "flatbuffers/js/flexbuffers/reference"
import { EcsType } from "./EcsType"

export function ArrayType<T>(type: EcsType<T>): EcsType<Array<T>> {
    return {
        serialize(value: Array<T>, builder: Builder): void {
            builder.startVector()
            for (const item of value) {
                type.serialize(item, builder)
            }
            builder.end()
        },
        deserialize(reader: Reference): Array<T> {
            const newArray: Array<T> = []
            for (let index = 0; index < reader.length(); index++) {
                const ref = reader.get(index)
                newArray.push(type.deserialize(ref))
            }
            return newArray
        },
    }
}
