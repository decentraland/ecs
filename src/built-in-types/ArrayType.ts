import { Parser } from "../serialization/Parser"
import { Serializer } from "../serialization/Serializer"
import { EcsType } from "./EcsType"

export function ArrayType<T>(type: EcsType<T>): EcsType<Array<T>> {
    return {
        serialize(value: Array<T>, builder: Serializer): void {
            builder.bb.writeUint32(value.length)
            for (const item of value) {
                type.serialize(item, builder)
            }
        },
        deserialize(reader: Parser): Array<T> {
            const newArray: Array<T> = []
            const length = reader.bb.readUint32()
            for (let index = 0; index < length; index++) {
                newArray.push(type.deserialize(reader))
            }
            return newArray
        },
    }
}
