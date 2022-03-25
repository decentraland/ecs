import { Entity, EntityContainer } from './entity'
import {
  ComponentDefinition,
  defineComponent as defComponent
} from './component'
import { ComponentEcsType } from './utils'
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

  function* mutableGroupOf<
    T extends [ComponentDefinition, ...ComponentDefinition[]]
  >(...componentDefnition: T): Iterable<[Entity, ...ComponentEcsType<T>]> {
    for (const [entity, ...components] of getComponentDefGroup(
      ...componentDefnition
    )) {
      yield [entity, ...components.map((c) => c.mutable(entity))] as any
    }
  }

  function* groupOf<T extends [ComponentDefinition, ...ComponentDefinition[]]>(
    ...componentDefnition: T
  ): Iterable<[Entity, ...Readonly<ComponentEcsType<T>>]> {
    for (const [entity, ...components] of getComponentDefGroup(
      ...componentDefnition
    )) {
      yield [entity, ...components.map((c) => c.getFrom(entity))] as any
    }
  }

  function* getComponentDefGroup<T extends ComponentDefinition[]>(
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
