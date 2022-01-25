export type Entity = number

export function EntityContainer() {
  const usedEntities: Set<Entity> = new Set()
  const unusedEntities: Set<Entity> = new Set(Array.from({ length: 1000 }, (v, index) => index))

  function generateEntity(): Entity {
    const iterator = unusedEntities[Symbol.iterator]()
    const result = iterator.next()

    if (result.done) {
      throw new Error('Entity rate limit')
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
    generateEntity,
    removeEntity
  }
}