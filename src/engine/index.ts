import { Entity, EntityContainer } from './entity'
import {
  ComponentDefinition,
  defineComponent as defComponent
} from './component'
import { ComponentEcsType, Update } from './types'
import { EcsType } from '../built-in-types'
import { defineSdkComponents } from '../components'
import { isNotUndefined } from './utils'
import { crdtSceneSystem } from '../systems/crdt'

/**
 * @alpha
 */
function preEngine() {
  const entityContainer = EntityContainer()
  const componentsDefinition = new Map<number, ComponentDefinition<any>>()
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

  function addEntity() {
    const entity = entityContainer.generateEntity()
    entitiesComponent.set(entity, new Set())
    return entity
  }

  function getEntityComponents(entity: Entity) {
    return Array.from(entitiesComponent.get(entity) || [])
      .map((classId) => componentsDefinition.get(classId))
      .filter(isNotUndefined)
  }

  function removeEntity(entity: Entity) {
    const components = getEntityComponents(entity)
    components.forEach((component) => component.deleteFrom(entity))

    entitiesComponent.delete(entity)
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
  ): ComponentDefinition<T> | undefined {
    return componentsDefinition.get(componentId)
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
    removeEntity,
    addSystem,
    defineComponent,
    mutableGroupOf,
    groupOf,
    getEntityComponents,
    getComponent
  }
}

/**
 * @alpha
 */
export type PreEngine = ReturnType<typeof preEngine>

// TODO Fix this type
export type Engine = ReturnType<typeof preEngine> & {
  baseComponents: ReturnType<typeof defineSdkComponents>
}

/**
 * @alpha
 */

export function Engine() {
  const engine = preEngine()
  const crdtSystem = crdtSceneSystem(engine)
  const baseComponents = defineSdkComponents(engine)

  function update(dt: number) {
    crdtSystem.processMessages()

    for (const system of engine.systems) {
      system(dt)
    }

    // TODO: Perf tip
    // Should we add some dirtyIteratorSet at engine level so we dont have
    // to iterate all the component definitions to get the dirty ones ?
    const dirtySet = new Set<Entity>()
    for (const [classId, definition] of engine.componentsDefinition) {
      for (const entity of definition.dirtyIterator()) {
        dirtySet.add(entity)
        const entityContainer = engine.entitiesComponent.get(entity)
        const isDelete = !definition.getOrNull(entity)
        isDelete
          ? entityContainer?.delete(classId)
          : entityContainer?.add(classId)
      }
    }

    crdtSystem.processDirtyComponents([...dirtySet])

    for (const [_classId, definition] of engine.componentsDefinition) {
      definition.clearDirty()
    }
  }

  return {
    addEntity: engine.addEntity,
    removeEntity: engine.removeEntity,
    addSystem: engine.addSystem,
    defineComponent: engine.defineComponent,
    mutableGroupOf: engine.mutableGroupOf,
    groupOf: engine.groupOf,
    getEntityComponents: engine.getEntityComponents,
    getComponent: engine.getComponent,
    update,
    baseComponents
  }
}
