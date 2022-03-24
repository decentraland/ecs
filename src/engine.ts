import { Entity, EntityContainer } from './entity'
import {
  ComponentDefinition,
  defineComponent as defComponent
} from './component'
import { Unpacked } from './utils'
import { EcsType } from './built-in-types'

type Update = (dt: number) => void

/**
 * @alpha
 */
export function Engine() {
  const entityContainer = EntityContainer()
  const componentsDefinition = new Map<number, ComponentDefinition<any>>()
  const systems = new Set<Update>()

  function addSystem(fn: Update) {
    if (systems.has(fn)) {
      throw new Error('System already added')
    }
    systems.add(fn)
  }

  function addEntity() {
    const entity = entityContainer.generateEntity()
    return entity
  }

  function removeEntity(entity: Entity) {
    for (const [, component] of componentsDefinition) {
      component.deleteFrom(entity)
    }
    return entityContainer.removeEntity(entity)
  }

  function defineComponent<T extends EcsType>(
    componentId: number,
    spec: T
  ): ComponentDefinition<T> {
    if (componentsDefinition.get(componentId)) {
      throw new Error(`Component ${componentId} already declared`)
    }
    const newComponent = defComponent<T>(componentId, spec)
    componentsDefinition.set(componentId, newComponent)
    return newComponent
  }

  // function* mutableGroupOf<T extends ComponentDefinition<any>>(
  //   component: T
  // ): Iterable<[Entity, any]> {
  //   const entities = componentsDefinition.get(component._id)!

  function mutableGroupOf<T1 extends ComponentDefinition<any>>(
    componentDefnition: T1
  ): Iterable<[Entity, ReturnType<T1['mutable']>]>
  function mutableGroupOf<
    T1 extends ComponentDefinition<any>,
    T2 extends ComponentDefinition<any>
  >(
    componentDefnition: T1,
    componentDefnition2: T2
  ): Iterable<[Entity, ReturnType<T1['mutable']>, ReturnType<T2['mutable']>]>
  function mutableGroupOf<
    T1 extends ComponentDefinition<any>,
    T2 extends ComponentDefinition<any>,
    T3 extends ComponentDefinition<any>
  >(
    componentDefnition: T1,
    componentDefnition2: T2,
    componentDefnition3: T3
  ): Iterable<
    [
      Entity,
      ReturnType<T1['mutable']>,
      ReturnType<T2['mutable']>,
      ReturnType<T3['mutable']>
    ]
  >
  function mutableGroupOf<T extends ComponentDefinition<any>[]>(
    ...componentDefnition: T
  ): Iterable<[Entity, ...Array<ReturnType<Unpacked<T>['mutable']>>]>
  function* mutableGroupOf<T extends ComponentDefinition<any>[]>(
    ...componentDefnition: T
  ): Iterable<[Entity, ...Array<ReturnType<Unpacked<T>['mutable']>>]> {
    for (const [entity, ...components] of getComponentDefGroup(
      ...componentDefnition
    )) {
      // TODO: see as any                                   =>
      yield [entity, ...(components.map((c) => c.mutable(entity)) as any)]
    }
  }

  function groupOf<T1 extends ComponentDefinition<any>>(
    componentDefnition: T1
  ): Iterable<[Entity, ReturnType<T1['getFrom']>]>
  function groupOf<
    T1 extends ComponentDefinition<any>,
    T2 extends ComponentDefinition<any>
  >(
    componentDefnition: T1,
    componentDefnition2: T2
  ): Iterable<[Entity, ReturnType<T1['getFrom']>, ReturnType<T2['getFrom']>]>
  function groupOf<
    T1 extends ComponentDefinition<any>,
    T2 extends ComponentDefinition<any>,
    T3 extends ComponentDefinition<any>
  >(
    componentDefnition: T1,
    componentDefnition2: T2,
    componentDefnition3: T3
  ): Iterable<
    [
      Entity,
      ReturnType<T1['getFrom']>,
      ReturnType<T2['getFrom']>,
      ReturnType<T3['getFrom']>
    ]
  >
  function groupOf<T extends ComponentDefinition<any>[]>(
    ...componentDefnition: T
  ): Iterable<[Entity, ...Array<Readonly<ReturnType<Unpacked<T>['getFrom']>>>]>
  function* groupOf<T extends ComponentDefinition<any>[]>(
    ...componentDefnition: T
  ): Iterable<
    [Entity, ...Array<Readonly<ReturnType<Unpacked<T>['getFrom']>>>]
  > {
    for (const [entity, ...components] of getComponentDefGroup(
      ...componentDefnition
    )) {
      // TODO: see as any                                   =>
      yield [entity, ...(components.map((c) => c.getFrom(entity)) as any)]
    }
  }

  function* getComponentDefGroup<T extends ComponentDefinition<any>[]>(
    ...args: T
  ): Iterable<[Entity, ...T]> {
    const [firstComponentDef, ...componentDefinitions] = args
    for (const [entity] of firstComponentDef.iterator()) {
      let matches = true
      for (const componentDef of componentDefinitions) {
        if (!componentDef.has(entity)) {
          matches = false
          break
        }
      }

      if (matches) {
        yield [entity, ...args]
      }
    }
  }

  function update(dt: number) {
    for (const system of systems) {
      system(dt)
    }

    for (const [, definition] of componentsDefinition) {
      definition.clearDirty()
    }
  }

  return {
    addEntity,
    removeEntity,
    addSystem,
    defineComponent,
    mutableGroupOf,
    groupOf,
    update
  }
}

/**
 * @alpha
 */
export type Engine = ReturnType<typeof Engine>
