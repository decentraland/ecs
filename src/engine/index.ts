import { Entity, EntityContainer } from './entity'
import {
  ComponentDefinition,
  defineComponent as defComponent
} from './component'
import { ComponentEcsType, Update } from './types'
import { EcsType } from '../built-in-types'
import { defineSdkComponents } from '../components'

/**
 * @alpha
 */
export function preEngine() {
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
  >(...components: T): Iterable<[Entity, ...ComponentEcsType<T>]> {
    for (const [entity, ...groupComp] of getComponentDefGroup(...components)) {
      yield [entity, ...groupComp.map((c) => c.mutable(entity))] as [
        Entity,
        ...ComponentEcsType<T>
      ]
    }
  }

  function* groupOf<T extends [ComponentDefinition, ...ComponentDefinition[]]>(
    ...components: T
  ): Iterable<[Entity, ...Readonly<ComponentEcsType<T>>]> {
    for (const [entity, ...groupComp] of getComponentDefGroup(...components)) {
      yield [entity, ...groupComp.map((c) => c.getFrom(entity))] as [
        Entity,
        ...Readonly<ComponentEcsType<T>>
      ]
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
export type Engine = ReturnType<typeof preEngine> & {
  baseComponents: ReturnType<typeof defineSdkComponents>
}

/**
 * @alpha
 */
export function Engine() {
  const engine = preEngine()
  const baseComponents = defineSdkComponents(engine)
  return {
    ...engine,
    baseComponents
  }
}
