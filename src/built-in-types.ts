
import { Builder } from 'flatbuffers/js/flexbuffers/builder'
import { Reference } from 'flatbuffers/js/flexbuffers/reference'

export type EcsType<T = any> = {
  serialize(value: T, builder: Builder): void,
  deserialize(reader: Reference): T
}

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
        newArray.push(type.deserialize(reader.get(index)))
      }
      return newArray
    },
  }
}


export interface Spec {
  [key: string]: EcsType
}

export type Result<T extends Spec> = {
  [K in keyof T]:
  T[K] extends EcsType ? ReturnType<T[K]['deserialize']>
  // : T[K] extends [EcsType] ? Array<ReturnType<T[K][0]['coerce']>>
  : T[K] extends Spec ? Result<T[K]>
  : never
}

export function MapType<T extends Spec>(spec: T): EcsType<Result<T>> {
  return {
    serialize(value: Result<T>, builder: Builder): void {
      builder.startVector()

      for (const key in spec) {
        const type = spec[key]
        type.serialize(value[key], builder)
      }

      builder.end()
    },
    deserialize(reader: Reference): Result<T> {
      const newValue: Result<T> = {} as any
      let index = 0

      for (const key in spec) {
        const type = spec[key]
        const currentRef = reader.get(index)
        newValue[key] = type.deserialize(currentRef)
        index += 1
      }

      return newValue
    }
  }
}

export const Int32: EcsType<number> = {
  serialize(value: number, builder: Builder): void {
    builder.addInt(value)
  },
  deserialize(reader: Reference): number {
    return reader.numericValue()! as number
  }
}

export const Float: EcsType<number> = {
  serialize(value: number, builder: Builder): void {
    builder.addFloat(value)
  },
  deserialize(reader: Reference): number {
    return reader.floatValue()!
  }
}

export const createVector3 = (x: number, y: number, z: number) => ({ x, y, z })

export const AllAcceptedTypes = [
  Int32, Float
]