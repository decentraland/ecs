import { Entity, EntityContainer } from './entity'
import { ComponentDefinition } from './component'

export function Engine() {
  const entityContainer = EntityContainer()
  const entityComponents = new Map<Entity, any>()
  const componentsDefinition = new Map<number, typeof entityComponents>()
  const dirtyIterator = new Map<Entity, Set<number>>()
  const entitiesToDestroy = new Set<Entity>()

  function addEntity() {
    const entity = entityContainer.generateEntity()
    return entity
  }

  function removeEntity(entity: Entity) {
    entitiesToDestroy.add(entity)
    return entityContainer.removeEntity(entity)
  }

  function defineComponent<T>(componentId: number): ComponentDefinition<T> {
    if (componentsDefinition.get(componentId)) {
      throw new Error(`Component ${componentId} already declared`)
    }
    componentsDefinition.set(componentId, new Map())

    return {
      _id: componentId,
      getOrNull: function(entity: Entity) {
        return componentsDefinition.get(componentId)?.get(entity)
      },
      getFrom: function(entity: Entity): Readonly<T> {
        const component = componentsDefinition.get(componentId)?.get(entity)
        if (!component) {
          throw new Error(`Component ${componentId} for ${entity} not found`);
        }
        return component
       },
      create: function(entity: Entity, value: T): Readonly<T> {
        const componentMap = componentsDefinition.get(componentId)
        componentMap?.set(entity, value)

        return value
      },
      mutable: function(entity: Entity): T {
        // TODO cach the ?. case
        dirtyIterator.get(entity)?.add(componentId)
        return componentsDefinition.get(componentId)?.get(entity)
      }
    }
  }

  function *mutableGroupOf<T extends ComponentDefinition<any>>(component: T): Iterable<[Entity, ReturnType<T['mutable']>]> {
    const entities = componentsDefinition.get(component._id)!

    for (const [entity, data] of entities) {
      dirtyIterator.get(entity)?.add(component._id)
      yield [entity, data]
    }
  }

  function *groupOf<T extends ComponentDefinition<any>>(component: T): Iterable<[Entity, ReturnType<T['getFrom']>]> {
    const entities = componentsDefinition.get(component._id)!

    for (const [entity, data] of entities) {
      yield [entity, Object.freeze(data)]
    }
  }

  function update() {
    for (const entity of entitiesToDestroy) {
      // How we iterate the entities to destroy?
      // Do we have a new map with the entities or we iterate all the component
      // definitions and if some of them has the entity to destroy we delete them ?
    }
  }


  return {
    addEntity,
    removeEntity,
    defineComponent,
    mutableGroupOf,
    groupOf,
    update,
  }
}