import { Entity } from './entity'

export interface Spec<T = any> {
  [key: string]: T
}

// type Result<T extends Spec> = {
//   [K in keyof T]: ReturnType<T[K]>
// }


export type ComponentDefinition<T extends Spec> = {
  _id: number
  // removeFrom(entity: Entity): void
  getFrom(entity: Entity): Readonly<T>

  // getOrNull(entity: Entity): Readonly<Result<T>> | null

  // adds this component to the list "to be reviewed next frame"
  create(entity: Entity, val: T): Readonly<T>

  // adds this component to the list "to be reviewed next frame"
  mutable(entity: Entity): T

  // updateFromBinary(entity: Entity, data: Uint8Array): void
  // toBinary(entity: Entity): Uint8Array

  // iterator(): Iterable<[Entity, T]>
  // dirtyIterator(): Iterable<Entity>
}

export function defineComponent<T extends Spec> (
  componentId: number,
  // shape: T
  // serializers, etc
): ComponentDefinition<T> {
  const map = new Map<Entity, Readonly<T>>()

  function getFrom(entity: Entity) {
    const component = map.get(entity)
    if (component) {
      return component
    }
    throw new Error(`Component ${componentId} for ${entity} not found`)
  }

  function put(entity: Entity, val: T) {
    map.set(entity, val)
    return getFrom(entity)
  }

  return {
    getFrom,
    put,
    // componentId,
  }
}