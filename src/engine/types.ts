import { EcsType } from '../built-in-types'
import { defineSdkComponents } from '../components'
import { ComponentDefinition as CompDef } from './component'
import { Entity } from './entity'

export type Unpacked<T> = T extends (infer U)[] ? U : T
export type Update = (dt: number) => void

export type ComponentEcsType<T extends [CompDef, ...CompDef[]]> = {
  [K in keyof T]: T[K] extends CompDef ? ReturnType<T[K]['mutable']> : never
}

export type DeepReadonly<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>
}

/**
 * @public
 */
export type IEngine = {
  addEntity(dynamic?: boolean): Entity
  addDynamicEntity(): Entity
  removeEntity(entity: Entity): void
  addSystem(system: Update): void
  defineComponent<T extends EcsType>(componentId: number, spec: T): CompDef<T>
  mutableGroupOf<T extends [CompDef, ...CompDef[]]>(
    ...components: T
  ): Iterable<[Entity, ...ComponentEcsType<T>]>
  groupOf<T extends [CompDef, ...CompDef[]]>(
    ...components: T
  ): Iterable<[Entity, ...DeepReadonly<ComponentEcsType<T>>]>
  getComponent<T extends EcsType>(componentId: number): CompDef<T>
  update(dt: number): void
  baseComponents: ReturnType<typeof defineSdkComponents>
}
