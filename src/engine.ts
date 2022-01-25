import { addComponentsToEngine as addExternalComponents } from './external-components'
import { Entity, EntityContainer } from './entity'
import { ComponentDefinition } from './component'

export function Engine() {
  const entityContainer = EntityContainer()
  const entityComponents = new Map<Entity, any>()
  const componentsDefinition = new Map<number, typeof entityComponents>()
  const dirtyIterator = new Map<Entity, Set<number>>()
  const entitiesToDestroy = new Set<Entity>()

  function addEntity() {
    return entityContainer.generateEntity()
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
      getFrom: function(entity: Entity): Readonly<T> {
        return componentsDefinition.get(componentId)?.get(entity)
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

  function mutableGroupOf<T extends ComponentDefinition<any>>(component: T): Iterable<[Entity, ReturnType<T['mutable']>]> {
    const entities = componentsDefinition.get(component._id)!
      return {
        [Symbol.iterator]() {
        const iterator = entities[Symbol.iterator]()
        return {
          next() {
            const result = iterator.next()
            if (!result.done) {
              const [entity] = result.value
              dirtyIterator.get(entity)?.add(component._id)
            }
            return result
          }
        }
      }
    }
  }

  function groupOf<T extends ComponentDefinition<any>>(component: T): Iterable<[Entity, ReturnType<T['getFrom']>]> {
    const entities = componentsDefinition.get(component._id)!
    return entities[Symbol.iterator]()
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
    defineComponent,
    mutableGroupOf,
    groupOf,
    update,
  }
}

type Position = {
  x: number
}
type Velocity = {
  y: number
}

const engine = Engine()
const Pos = engine.defineComponent<Position>(1)
const Vel = engine.defineComponent<Velocity>(2)
const entity = engine.addEntity()
const position = Pos.create(entity, { x: 1 } )

console.log(position)

const positionMutable = Pos.mutable(entity)
positionMutable.x = 1

for (const [entity, position] of engine.mutableGroupOf(Pos)) {
  position.x = Vel.getFrom(entity).y
}

for (const [entity, position] of engine.groupOf(Pos)) {
  position.x = Vel.getFrom(entity).y
}

const { Position } = addExternalComponents(engine)
const externalPos = Position.create(engine.addEntity(), { x: 1 })
console.log(externalPos.x)