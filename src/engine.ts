import { Entity, EntityContainer } from "./entity"
import { ComponentDefinition, defineComponent as defComponent, Result, Spec } from "./component"
import { readonly } from "./utils"

type Update = (dt: number) => void

export function Engine() {
  const entityContainer = EntityContainer()
  const componentsDefinition = new Map<number, ComponentDefinition<any>>()
  const systems = new Set<Update>()

  function addSystem(fn: Update) {
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
  function defineComponent<T extends Spec>(componentId: number, spec: T): ComponentDefinition<T> {
    if (componentsDefinition.get(componentId)) {
      throw new Error(`Component ${componentId} already declared`)
    }

    type ComponentType = Result<T>
    const newComponent = defComponent<T>(componentId, spec)
    componentsDefinition.set(componentId, newComponent)

    return newComponent
  }

  function* mutableGroupOf<T extends ComponentDefinition<any>>(
    component: T
  ): Iterable<[Entity, any]> {
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
  }

  return {
    addEntity,
    addSystem,
    removeEntity,
    defineComponent,
    mutableGroupOf,
    groupOf,
    update,
  }
}
