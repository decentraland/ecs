import { EntityContainer } from '../src/entity'

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

  it('rate limit', () => {
    const entityContainer = EntityContainer()
    const { unusedEntities } = entityContainer

    for (const _ of unusedEntities) {
      entityContainer.generateEntity()
    }
    let error
    try {
      entityContainer.generateEntity()
    } catch(e) {
      error = true
    }

    expect(error).toBe(true)
  })
})