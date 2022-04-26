import { ByteBuffer } from '../serialization/ByteBuffer'
import { EcsType } from './EcsType'

export interface Spec {
  [key: string]: EcsType
}

/** Include property keys from T where the property is assignable to U */
type IncludeUndefined<T> = {
  [P in keyof T]: undefined extends T[P] ? P : never
}[keyof T]

/** Excludes property keys from T where the property is assignable to U */
type ExcludeUndefined<T> = {
  [P in keyof T]: undefined extends T[P] ? never : P
}[keyof T]

type OnlyOptionalUndefinedTypes<T> = { [K in IncludeUndefined<T>]?: T[K] }
type OnlyNonUndefinedTypes<T> = { [K in ExcludeUndefined<T>]: T[K] }

type ToOptional<T> = OnlyOptionalUndefinedTypes<T> & OnlyNonUndefinedTypes<T>

export type Result<T extends Spec> = ToOptional<{
  [K in keyof T]: T[K] extends EcsType
    ? ReturnType<T[K]['deserialize']> extends undefined
      ? never
      : ReturnType<T[K]['deserialize']>
    : T[K] extends Spec
    ? Result<T[K]>
    : never
}>

export function MapType<T extends Spec>(spec: T): EcsType<Result<T>> {
  return {
    serialize(value: Result<T>, builder: ByteBuffer): void {
      for (const key in spec) {
        spec[key].serialize((value as any)[key], builder)
      }
    },
    deserialize(reader: ByteBuffer): Result<T> {
      const newValue: Result<T> = {} as any
      for (const key in spec) {
        ;(newValue as any)[key] = spec[key].deserialize(reader)
      }
      return newValue
    }
  }
}
