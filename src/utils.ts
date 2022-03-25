import { ComponentDefinition } from './component'

export type Unpacked<T> = T extends (infer U)[] ? U : T

export type ComponentEcsType<
  T extends [ComponentDefinition, ...ComponentDefinition[]]
> = {
  [K in keyof T]: T[K] extends ComponentDefinition
    ? ReturnType<T[K]['mutable']>
    : never
}

const isProd = () => false

export function readonly<T extends Record<string, unknown>>(
  val: T
): Readonly<T> {
  // Fail only on development due to perf issues
  if (isProd()) {
    return val
  }
  return Object.freeze({ ...val })
}
