import { Builder } from "flatbuffers/js/flexbuffers/builder"
import { Reference } from "flatbuffers/js/flexbuffers/reference"
import { EcsType } from "./EcsType"

export interface Spec {
  [key: string]: EcsType
}

export type Result<T extends Spec> = {
  [K in keyof T]: T[K] extends EcsType ? ReturnType<T[K]['deserialize']> : T[K] extends Spec ? Result<T[K]> : never
}

export function MapType<T extends Spec>(spec: T): EcsType<Result<T>> {
  return {
    serialize(value: Result<T>, builder: ByteBuffer): void {
      for (const key in spec) {
        const type = spec[key]
        type.serialize(value[key], builder)
      }
    },
    deserialize(reader: ByteBuffer): Result<T> {
      const newValue: Result<T> = {} as any
      for (const key in spec) {
        const type = spec[key]
        newValue[key] = type.deserialize(reader)
      }
      return newValue
    }
  }
}