
import { Builder } from 'flatbuffers/js/flexbuffers/builder'
import { Reference } from 'flatbuffers/js/flexbuffers/reference'

export type EcsType<T=any> = {
  serialize(value: T, builder: Builder): void,
  deserialize(reader: Reference): T
  coerce(value: any): T
}

export const Int32: EcsType<number> = {
  serialize(value: number, builder: Builder): void {
    builder.addInt(value)
  },
  deserialize(reader: Reference): number {
    return reader.numericValue()! as number
  },
  coerce(value: any): number {
    if (typeof value == 'number') {
      return value
    } else {
      throw new Error("invalid type")
    }
  }
}

export const Float: EcsType<number> = {
  serialize(value: number, builder: Builder): void {
    builder.addFloat(value)
  },
  deserialize(reader: Reference): number {
    return reader.floatValue()!
  },
  coerce(value: any): number {
    if (typeof value == 'number') {
      return value
    } else {
      throw new Error("invalid type")
    }
  }
}

export const createVector3 = (x: number, y: number, z: number) => ({ x, y, z })

export const AllAcceptedTypes = [
  Int32, Float
]