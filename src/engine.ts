import { Entity, EntityContainer } from "./entity"
import { ComponentDefinition } from "./component"

type Update = (dt: number) => void

function getComponent<T>(componentId: number): ComponentDefinition<T> {
  const data = new Map<Entity, T>()
  const dirtyIterator = new Set<Entity>()

  return {
    _id: componentId,
    deleteFrom: function (entity: Entity): T | null {
      const component = data.get(entity)
      data.delete(entity)
      return component || null
    },
    getOrNull: function (entity: Entity): Readonly<T> | null {
      const component = data.get(entity)
      return component ? readonly(component) : null
    },
    getFrom: function (entity: Entity): Readonly<T> {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }
      return readonly(component)
    },
    create: function (entity: Entity, value: T): T {
      data.set(entity, value)
      dirtyIterator.add(entity)
      return value
    },
    mutable: function (entity: Entity): T {
      // TODO cach the ?. case
      dirtyIterator.add(entity)
      // TODO !
      return data.get(entity)!
    },
    iterator: function* (): Iterable<[Entity, T]> {
      for (const [entity, component] of data) {
        yield [entity, component]
      }
    },
    dirtyIterator: function* (): Iterable<Entity> {
      for (const entity of dirtyIterator) {
        yield entity
      }
    },
  }
}

function readonly<T extends Object>(val: T): Readonly<T> {
  return Object.freeze({ ...val })
}

export function Engine() {
  // const entities = new Map<Entity, Map<number, any>>()
  const entityContainer = EntityContainer()
  const componentsDefinition = new Map<number, ComponentDefinition<any>>()
  const systems = new Set<Update>()

  function addSystem(fn: (deltaTime: number) => void) {
    if (systems.has(fn)) {
      throw new Error("System already added")
    }
    systems.add(fn)
  }

  function addEntity() {
    const entity = entityContainer.generateEntity()
    return entity
  }

  function removeEntity(entity: Entity) {
    for (const [_, component] of componentsDefinition) {
      component.deleteFrom(entity)
    }
    return entityContainer.removeEntity(entity)
  }

  function defineComponent<T>(componentId: number): ComponentDefinition<T> {
    if (componentsDefinition.get(componentId)) {
      throw new Error(`Component ${componentId} already declared`)
    }

    const newComponent = getComponent<T>(componentId)
    componentsDefinition.set(componentId, newComponent)

    return newComponent
  }

  function* mutableGroupOf<T extends ComponentDefinition<any>>(
    component: T
  ): Iterable<[Entity, ReturnType<T["mutable"]>]> {
    const entities = componentsDefinition.get(component._id)!

    for (const [entity, data] of entities.iterator()) {
      yield [entity, component.mutable(entity)]
    }
  }

  function* groupOf<T extends ComponentDefinition<any>>(component: T): Iterable<[Entity, ReturnType<T["getFrom"]>]> {
    const entities = componentsDefinition.get(component._id)!

    for (const [entity, data] of entities.iterator()) {
      // TODO: check if this is necessary.
      yield [entity, readonly(data) as ReturnType<T["getFrom"]>]
    }
  }

  function update(dt: number) {
    for (const system of systems) {
      system(dt)
    }
    // const components = entities.get(entity)!
    //   for (const [classId, cmp] of components) {
    //     components.delete(classId)
    //   }
    //   entities.delete(entity)
    //   const classesId = Array.from(entities.get(entity) || [])
    //   classesId.forEach((classId) => {
    //     componentsDefinition.get(classId)?.delete(entity)
    //   })
    // entities.delete(entity)
    // How we iterate the entities to destroy?
    // Do we have a new map with the entities or we iterate all the component
    // definitions and if some of them has the entity to destroy we delete them ?
    // }
  }

  return {
    addEntity,
    addSystem,
    removeEntity,
    defineComponent,
    getComponent,
    mutableGroupOf,
    groupOf,
    update,
  }
}
