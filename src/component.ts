import { Entity } from './entity'
import { readonly } from './utils'

export interface Spec<T = any> {
  [key: string]: T
}

export type ComponentDefinition<T extends Spec> = {
  _id: number
  has(entity: Entity): boolean
  // removeFrom(entity: Entity): void
  getFrom(entity: Entity): Readonly<T>

  getOrNull(entity: Entity): Readonly<T> | null

  // adds this component to the list "to be reviewed next frame"
  create(entity: Entity, val: T): T

  // adds this component to the list "to be reviewed next frame"
  createOrReplace(entity: Entity, val: T): T

  // adds this component to the list "to be reviewed next frame"
  mutable(entity: Entity): T

  deleteFrom(entity: Entity): T | null

  // updateFromBinary(entity: Entity, data: Uint8Array): void
  // toBinary(entity: Entity): Uint8Array

  iterator(): Iterable<[Entity, T]>
  dirtyIterator(): Iterable<Entity>
  clearDirty(): void
}

export function defineComponent<T>(componentId: number): ComponentDefinition<T> {
  const data = new Map<Entity, T>()
  let dirtyIterator = new Set<Entity>()

  return {
    _id: componentId,
    has: function(entity: Entity): boolean {
      return data.has(entity)
    },
    deleteFrom: function (entity: Entity): T | null {
      const component = data.get(entity)
      data.delete(entity)
      return component || null
    },
    getOrNull: function (entity: Entity): Readonly<T> | null {
      const component = data.get(entity)
      return component ? readonly(component) : null
    },
    getFrom: function (entity: Entity): Readonly<T> {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }
      return readonly(component)
    },
    create: function (entity: Entity, value: T): T {
      const component = data.get(entity)
      if (component) {
        throw new Error(`Component ${componentId} for ${entity} already exists`)
      }
      data.set(entity, value)
      dirtyIterator.add(entity)
      return value
    },
    createOrReplace: function(entity: Entity, value: T) : T {
      data.set(entity, value)
      dirtyIterator.add(entity)
      return value
    },
     mutable: function (entity: Entity): T {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }
      dirtyIterator.add(entity)
      return component
    },
    iterator: function* (): Iterable<[Entity, T]> {
      for (const [entity, component] of data) {
        yield [entity, component]
      }
    },
    dirtyIterator: function* (): Iterable<Entity> {
      for (const entity of dirtyIterator) {
        yield entity
      }
    },
    clearDirty: function() {
      dirtyIterator = new Set<Entity>()
    }
  }
}