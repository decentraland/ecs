declare const entitySymbol: unique symbol

export type Entity = number & { [entitySymbol]: true }

function Entity(entity: number): Entity {
  return entity as Entity
}

type Config = { start: number; finish: number }

export function EntityContainer(configParam?: Config) {
  const config: Config = configParam || { start: 0, finish: 1000 }
  const usedEntities: Set<Entity> = new Set()
  const unusedEntities: Set<Entity> = new Set()

  function generateEntity(): Entity {
    if (!unusedEntities.size && !usedEntities.size) {
      const entity = Entity(config.start)
      usedEntities.add(entity)
      return entity
    }

    const iterator = unusedEntities[Symbol.iterator]()
    const result = iterator.next()

    if (result.done) {
      const entity = Entity(Math.max(...usedEntities.values()) + 1)
      if (entity >= config.finish) {
        throw new Error('Entity rate limit exceed')
      }
      usedEntities.add(entity)
      return entity
    }

    const entity = result.value
    unusedEntities.delete(entity)
    usedEntities.add(entity)

    return entity
  }

  function removeEntity(entity: Entity) {
    usedEntities.delete(entity)
    unusedEntities.add(entity)
  }

  return {
    unusedEntities,
    usedEntities,
    generateEntity,
    removeEntity
  }
}
