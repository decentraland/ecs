import { EcsType, MapType, Result, Spec } from './built-in-types'
import { Entity } from './entity'
import { readonly } from './utils'
import * as flexbuffers from 'flatbuffers/js/flexbuffers'
import ByteBuffer from 'bytebuffer'
import { createSerializer } from './serialization/Serializer'
import { createParser } from './serialization/Parser'

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
  fromBinary: (data: Uint8Array) => EcsResult<T>
}

export function defineComponent<T extends Spec>(componentId: number, specObject: T, customSerializerParser?: CustomSerializerParser<EcsType<Result<T>>>) {
  const spec = MapType(specObject)
  type ComponentType = EcsResult<EcsType<Result<T>>>
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

      if (customSerializerParser) {
        return customSerializerParser.toBinary(component)
      }

      const buffer = createSerializer()
      spec.serialize(component, buffer)
      return buffer.getData()
    },
    updateFromBinary(entity: Entity, dataArray: Uint8Array) {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }

      if (customSerializerParser) {
        const newValue = customSerializerParser.fromBinary(dataArray)
        data.set(entity, newValue)
        return
      }

      const buffer = createParser(dataArray)
      const newValue = spec.deserialize(buffer)
      data.set(entity, newValue)
    }
  }
}
