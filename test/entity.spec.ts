import { EntityContainer } from '../src/engine/entity'
import * as entityOffset from '../src/engine/entity-offset'

describe('Entity container', () => {
  it('generates new entities', () => {
    const entityContainer = EntityContainer()
    const entityA = entityContainer.generateEntity()
    expect(entityA).toBe(0)
    expect(entityContainer.getUsedEntities().has(entityA)).toBe(true)
    expect(entityContainer.getUnusedEntities().has(entityA)).toBe(false)
  })

  it('destroy entities', () => {
    const entityContainer = EntityContainer()
    const entityA = entityContainer.generateEntity()
    entityContainer.removeEntity(entityA)
    expect(entityContainer.getUsedEntities().has(entityA)).toBe(false)
    expect(entityContainer.getUnusedEntities().has(entityA)).toBe(true)
  })

  it('generates entities and reuse unused', () => {
    const entityContainer = EntityContainer()
    const entityA = entityContainer.generateEntity()
    const entityB = entityContainer.generateEntity()
    expect(entityA).toBe(0)
    expect(entityB).toBe(1)
    entityContainer.removeEntity(entityA)
    expect(entityContainer.getUnusedEntities().has(entityA)).toBe(true)
    expect(entityContainer.generateEntity()).toBe(entityA)
    expect(entityContainer.getUsedEntities().has(entityA)).toBe(true)
    expect(entityContainer.getUnusedEntities().has(entityA)).toBe(false)
  })

  it.only('rate limit', () => {
    const entityContainer = EntityContainer()
    for (let i = 0; i < entityOffset.EntityOffset.MAX; i++) {
      entityContainer.generateEntity()
    }
    expect(entityContainer.generateEntity).toThrowError()
  })

  it('generates dynamic entities', () => {
    jest.spyOn(entityOffset.EntityOffset, 'getOffset').mockReturnValue(20000)
    const entityContainer = EntityContainer()
    const staticEntity = entityContainer.generateEntity()
    const dynamicEntity = entityContainer.generateEntity(true)
    expect(staticEntity).toBe(0)
    expect(dynamicEntity).toBe(20000)
  })
})
