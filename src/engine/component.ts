import { EcsType } from '../built-in-types'
import { ByteBuffer, createByteBuffer } from '../serialization/ByteBuffer'
import { Entity } from './entity'
import { readonly } from './utils'

export type EcsResult<T extends EcsType> = T extends EcsType
  ? ReturnType<T['deserialize']>
  : never

export type ComponentType<T extends EcsType> = EcsResult<T>

export type ComponentDefinition<T extends EcsType = EcsType<any>> = {
  _id: number
  has(entity: Entity): boolean
  // removeFrom(entity: Entity): void
  getFrom(entity: Entity): Readonly<ComponentType<T>>

  getOrNull(entity: Entity): Readonly<ComponentType<T>> | null

  // adds this component to the list "to be reviewed next frame"
  create(entity: Entity, val: ComponentType<T>): ComponentType<T>

  // adds this component to the list "to be reviewed next frame"
  mutable(entity: Entity): ComponentType<T>
  createOrReplace(entity: Entity, val: ComponentType<T>): ComponentType<T>

  deleteFrom(entity: Entity): ComponentType<T> | null

  updateOrCreateFromBinary(
    entity: Entity,
    data: ByteBuffer
  ): ComponentType<T> | null
  updateFromBinary(entity: Entity, data: ByteBuffer): ComponentType<T> | null
  // allocates a buffer and returns new buffer
  toBinary(entity: Entity): ByteBuffer
  // writes to a pre-allocated buffer
  writeToByteBuffer(entity: Entity, buffer: ByteBuffer): void

  iterator(): Iterable<[Entity, ComponentType<T>]>
  dirtyIterator(): Iterable<Entity>
  clearDirty(): void
}

export function defineComponent<T extends EcsType>(
  componentId: number,
  spec: T
): ComponentDefinition<T> {
  const data = new Map<Entity, ComponentType<T>>()
  let dirtyIterator = new Set<Entity>()

  return {
    _id: componentId,
    has: function (entity: Entity): boolean {
      return data.has(entity)
    },
    deleteFrom: function (entity: Entity): ComponentType<T> | null {
      const component = data.get(entity)
      data.delete(entity)
      return component || null
    },
    getOrNull: function (entity: Entity): Readonly<ComponentType<T>> | null {
      const component = data.get(entity)
      return component ? readonly(component) : null
    },
    getFrom: function (entity: Entity): Readonly<ComponentType<T>> {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }
      return readonly(component)
    },
    create: function (
      entity: Entity,
      value: ComponentType<T>
    ): ComponentType<T> {
      const component = data.get(entity)
      if (component) {
        throw new Error(`Component ${componentId} for ${entity} already exists`)
      }
      data.set(entity, value)
      dirtyIterator.add(entity)
      return value
    },
    createOrReplace: function (
      entity: Entity,
      value: ComponentType<T>
    ): ComponentType<T> {
      data.set(entity, value)
      dirtyIterator.add(entity)
      return value
    },
    mutable: function (entity: Entity): ComponentType<T> {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }
      dirtyIterator.add(entity)
      return component
    },
    iterator: function* (): Iterable<[Entity, ComponentType<T>]> {
      for (const [entity, component] of data) {
        yield [entity, component]
      }
    },
    dirtyIterator: function* (): Iterable<Entity> {
      for (const entity of dirtyIterator) {
        yield entity
      }
    },
    toBinary(entity: Entity): ByteBuffer {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }

      const writeBuffer = createByteBuffer()
      spec.serialize(component, writeBuffer)
      return writeBuffer
    },
    writeToByteBuffer(entity: Entity, buffer: ByteBuffer): void {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }

      spec.serialize(component, buffer)
    },
    updateFromBinary(
      entity: Entity,
      buffer: ByteBuffer
    ): ComponentType<T> | null {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }
      return this.updateOrCreateFromBinary(entity, buffer)
    },
    updateOrCreateFromBinary(
      entity: Entity,
      buffer: ByteBuffer
    ): ComponentType<T> | null {
      const newValue = spec.deserialize(buffer)
      data.set(entity, newValue)
      return newValue
    },
    clearDirty: function () {
      dirtyIterator = new Set<Entity>()
    }
  }
}
