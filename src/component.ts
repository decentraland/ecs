import { Entity } from './entity'

export interface Spec<T = any> {
  [key: string]: T
}

export type ComponentDefinition<T extends Spec> = {
  _id: number
  // removeFrom(entity: Entity): void
  getFrom(entity: Entity): Readonly<T>

  getOrNull(entity: Entity): Readonly<T> | null

  // adds this component to the list "to be reviewed next frame"
  create(entity: Entity, val: T): Readonly<T>

  // adds this component to the list "to be reviewed next frame"
  mutable(entity: Entity): T

  // updateFromBinary(entity: Entity, data: Uint8Array): void
  // toBinary(entity: Entity): Uint8Array

  // iterator(): Iterable<[Entity, T]>
  // dirtyIterator(): Iterable<Entity>
}