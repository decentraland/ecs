import { ComponentDefinition as CompDef } from './component'

export type Unpacked<T> = T extends (infer U)[] ? U : T
export type Update = (dt: number) => void

export type ComponentEcsType<T extends [CompDef, ...CompDef[]]> = {
  [K in keyof T]: T[K] extends CompDef ? ReturnType<T[K]['mutable']> : never
}

export type DeepReadonly<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>
}
