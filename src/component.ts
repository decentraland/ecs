import { EcsType } from './built-in-types'
import { Entity } from './entity'
import { readonly } from './utils'
import * as flexbuffers from 'flatbuffers/js/flexbuffers'
import { Reference } from 'flatbuffers/js/flexbuffers/reference'

// export type Handler<T = any> = (value: string, name: string, previousValue?: T) => T

export type EcsResult<T extends EcsType> =
  T extends EcsType ? ReturnType<T['deserialize']>
  : never

export type ComponentDefinition<T extends EcsType> = {
  _id: number
  // removeFrom(entity: Entity): void
  getFrom(entity: Entity): Readonly<EcsResult<T>>

  getOrNull(entity: Entity): Readonly<EcsResult<T>> | null

  // adds this component to the list "to be reviewed next frame"
  create(entity: Entity, val: EcsResult<T>): EcsResult<T>

  // adds this component to the list "to be reviewed next frame"
  mutable(entity: Entity): EcsResult<T>

  deleteFrom(entity: Entity): EcsResult<T> | null

  updateFromBinary(entity: Entity, data: Uint8Array, offset: number): void
  toBinary(entity: Entity): Uint8Array

  iterator(): Iterable<[Entity, EcsResult<T>]>
  dirtyIterator(): Iterable<Entity>
}

export type CustomSerializerParser<T extends EcsType> = {
  toBinary: (data: EcsResult<T>) => Uint8Array,
  fromBinary: (data: Uint8Array, offset: number) => EcsResult<T>
}

export function defineComponent<T extends EcsType>(componentId: number, spec: T, customBridge?: CustomSerializerParser<T>) {
  type ComponentType = EcsResult<T>
  const data = new Map<Entity, ComponentType>()
  const dirtyIterator = new Set<Entity>()

  return {
    _id: componentId,
    deleteFrom: function (entity: Entity): ComponentType | null {
      const component = data.get(entity)
      data.delete(entity)
      return component || null
    },
    getOrNull: function (entity: Entity): Readonly<ComponentType> | null {
      const component = data.get(entity)
      return component ? readonly(component) : null
    },
    getFrom: function (entity: Entity): Readonly<ComponentType> {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }
      return readonly(component)
    },
    create: function (entity: Entity, value: ComponentType): ComponentType {
      data.set(entity, value)
      dirtyIterator.add(entity)
      return value
    },
    mutable: function (entity: Entity): ComponentType {
      // TODO cach the ?. case
      dirtyIterator.add(entity)
      // TODO !
      return data.get(entity)!
    },
    iterator: function* (): Iterable<[Entity, ComponentType]> {
      for (const [entity, component] of data) {
        yield [entity, component]
      }
    },
    dirtyIterator: function* (): Iterable<Entity> {
      for (const entity of dirtyIterator) {
        yield entity
      }
    },
    toBinary(entity: Entity): Uint8Array {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }

      const builder = flexbuffers.builder()
      spec.serialize(component, builder)

      return builder.finish()
    },
    updateFromBinary(entity: Entity, dataArray: Uint8Array, offset: number = 0) {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }

      if (customBridge) {
        const newValue = customBridge.fromBinary(dataArray, offset)
        data.set(entity, newValue)
        return
      }

      const ref = flexbuffers.toReference(dataArray.subarray(offset).buffer)
      const newValue = spec.deserialize(ref)
      data.set(entity, newValue)
    }
  }
}
