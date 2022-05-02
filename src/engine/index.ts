import { Entity, EntityContainer } from './entity'
import {
  ComponentDefinition,
  defineComponent as defComponent
} from './component'
import { ComponentEcsType, Update } from './types'
import { EcsType } from '../built-in-types'
import { defineSdkComponents } from '../components'
import { crdtSceneSystem } from '../systems/crdt'
import { Transport } from '../systems/crdt/transport'

/**
 * @alpha
 */
function preEngine() {
  const entityContainer = EntityContainer()
  const componentsDefinition = new Map<number, ComponentDefinition<any>>()
  // TODO: find a way to make this work.
  // Maybe a proxy/callback to be up-to-date
  const entitiesComponent = new Map<
    number,
    Set<ComponentDefinition<any>['_id']>
  >()
  const systems = new Set<Update>()

  function addSystem(fn: Update) {
    if (systems.has(fn)) {
      throw new Error('System already added')
    }
    systems.add(fn)
  }

  function addEntity(dynamic: boolean = false) {
    // entitiesCompnonent.set(entity, new Set())
    const entity = entityContainer.generateEntity(dynamic)
    return entity
  }

  function addDynamicEntity() {
    return addEntity(true)
  }

  function removeEntity(entity: Entity) {
    // TODO: Remove all the components of that entity
    for (const [, component] of componentsDefinition) {
      if (component.has(entity)) {
        component.deleteFrom(entity)
      }
    }
    // entitiesComponent.delete(entity)
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

  function getComponent<T extends EcsType>(
    componentId: number
  ): ComponentDefinition<T> {
    const component = componentsDefinition.get(componentId)
    if (!component) {
      throw new Error(
        'Component not found. You need to declare the components at the beginnig of the engine declaration'
      )
    }
    return component
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

  return {
    entitiesComponent,
    componentsDefinition,
    systems,
    addEntity,
    addDynamicEntity,
    removeEntity,
    addSystem,
    defineComponent,
    mutableGroupOf,
    groupOf,
    getComponent
  }
}

/**
 * @alpha
 */
export type PreEngine = ReturnType<typeof preEngine>

// TODO Fix this type
/**
 * @public
 */
export type Engine = {
  addEntity(dynamic?: boolean): Entity
  addDynamicEntity(): Entity
  removeEntity(entity: Entity): void
  addSystem(system: Update): void
  defineComponent<T extends EcsType>(
    componentId: number,
    spec: T
  ): ComponentDefinition<T>
  mutableGroupOf<T extends [ComponentDefinition, ...ComponentDefinition[]]>(
    ...components: T
  ): Iterable<[Entity, ...ComponentEcsType<T>]>
  groupOf<T extends [ComponentDefinition, ...ComponentDefinition[]]>(
    ...components: T
  ): Iterable<[Entity, ...Readonly<ComponentEcsType<T>>]>
  getComponent<T extends EcsType>(componentId: number): ComponentDefinition<T>
  update(dt: number): void
  baseComponents: ReturnType<typeof defineSdkComponents>
}

/**
 * @public
 */
export function Engine(transport?: Transport): Engine {
  const engine = preEngine()
  const crdtSystem = crdtSceneSystem(engine, transport)
  const baseComponents = defineSdkComponents(engine)

  function update(dt: number) {
    crdtSystem.processMessages()
    for (const system of engine.systems) {
      system(dt)
    }

    // TODO: Perf tip
    // Should we add some dirtyIteratorSet at engine level so we dont have
    // to iterate all the component definitions to get the dirty ones ?
    const dirtySet = new Map<Entity, Set<number>>()
    for (const [componentId, definition] of engine.componentsDefinition) {
      for (const entity of definition.dirtyIterator()) {
        if (!dirtySet.has(entity)) {
          dirtySet.set(entity, new Set())
        }
        dirtySet.get(entity)!.add(componentId)
      }
    }
    crdtSystem.send(dirtySet)

    for (const [_componentId, definition] of engine.componentsDefinition) {
      definition.clearDirty()
    }
  }

  return {
    addEntity: engine.addEntity,
    addDynamicEntity: engine.addDynamicEntity,
    removeEntity: engine.removeEntity,
    addSystem: engine.addSystem,
    defineComponent: engine.defineComponent,
    mutableGroupOf: engine.mutableGroupOf,
    groupOf: engine.groupOf,
    getComponent: engine.getComponent,
    update,
    baseComponents
  }
}
