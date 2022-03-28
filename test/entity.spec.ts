import { EntityContainer } from '../src/engine/entity'

describe('Entity container', () => {
  it('generates new entities', () => {
    const entityContainer = EntityContainer()
    const entityA = entityContainer.generateEntity()
    expect(entityA).toBe(0)
    expect(entityContainer.usedEntities.has(entityA)).toBe(true)
    expect(entityContainer.unusedEntities.has(entityA)).toBe(false)
  })

  it('destroy entities', () => {
    const entityContainer = EntityContainer()
    const entityA = entityContainer.generateEntity()
    entityContainer.removeEntity(entityA)
    expect(entityContainer.usedEntities.has(entityA)).toBe(false)
    expect(entityContainer.unusedEntities.has(entityA)).toBe(true)
  })

  it('generates entities and reuse unused', () => {
    const entityContainer = EntityContainer()
    const entityA = entityContainer.generateEntity()
    const entityB = entityContainer.generateEntity()
    expect(entityA).toBe(0)
    expect(entityB).toBe(1)
    entityContainer.removeEntity(entityA)
    expect(entityContainer.generateEntity()).toBe(entityA)
    expect(entityContainer.usedEntities.has(entityA)).toBe(true)
    expect(entityContainer.unusedEntities.has(entityA)).toBe(false)
  })

  it('rate limit', () => {
    const entityContainer = EntityContainer({ start: 0, finish: 1 })
    entityContainer.generateEntity()
    expect(entityContainer.generateEntity).toThrowError()
  })
})
