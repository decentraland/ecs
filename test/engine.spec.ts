import { Engine } from "../src/engine"
import { EntityContainer } from "../src/entity"
import { addComponentsToEngine as addExternalComponents } from "../src/external-components"

type Position = {
  x: number
}

type Velocity = {
  y: number
}

describe("Engine tests", () => {
  it("generates new entities", () => {
    const engine = Engine()
    const entityA = engine.addEntity()
    const entityB = engine.addEntity()
    expect(entityA).toBe(0)
    expect(entityB).toBe(1)
  })

  it("define component and creates new entity", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent<Position>(1)
    const posComponent = Position.create(entity, { x: 10 })
    expect(posComponent).toStrictEqual({ x: 10 })

    for (const [ent, position] of engine.groupOf(Position)) {
      expect(ent).toBe(entity)
      expect(position).toStrictEqual({ x: 10 })
    }

    for (const [ent, position] of engine.mutableGroupOf(Position)) {
      expect(ent).toBe(entity)
      expect(position).toStrictEqual({ x: 10 })
      position.x = 80
    }
    expect(Position.getFrom(entity)).toStrictEqual({ x: 80 })
  })

  it("iterate multiple components", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent<Position>(1)
    const Velocity = engine.defineComponent<Velocity>(2)
    const posComponent = Position.create(entity, { x: 10 })
    const velComponent = Velocity.create(entity, { y: 20 })

    expect(posComponent).toStrictEqual({ x: 10 })
    expect(velComponent).toStrictEqual({ y: 20 })

    for (const [ent, position] of engine.groupOf(Position)) {
      const velocity = Velocity.getFrom(ent)
      expect(ent).toBe(entity)
      expect(velocity).toStrictEqual({ y: 20 })
      expect(position).toStrictEqual({ x: 10 })
    }
  })

  it("should not update a readonly prop", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent<Position>(1)
    expect(Array.from(Position.dirtyIterator())).toEqual([])
    const posComponent = Position.create(entity, { x: 10 })
    posComponent.x = 1000000000000
    expect(Array.from(Position.dirtyIterator())).toEqual([entity])
    expect(Position.getFrom(entity)).toStrictEqual({ x: 1000000000000 })
  })

  it("should not update a readonly prop groupOf", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent<Position>(1)
    const posComponent = Position.create(entity, { x: 10 })
    for (const [entity, position] of engine.groupOf(Position)) {
      // @ts-ignore
      expect(() => position.x = 1000000000000).toThrowError()
    }
    expect(Position.getFrom(entity)).toStrictEqual({ x: 10 })
  })

  it("should not update a readonly prop getFrom(entity)", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent<Position>(1)
    Position.create(entity, { x: 10 })
    // @ts-ignore
    const assignError = () => Position.getFrom(entity).x = 1000000000000
    expect(assignError).toThrowError()
    expect(Position.getFrom(entity)).toStrictEqual({ x: 10 })
  })

  it("should fail if we fetch a component that doesnt exists on an entity", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent<Position>(1)
    const Velocity = engine.defineComponent<Velocity>(2)
    Position.create(entity, { x: 10 })
    expect(() => Velocity.getFrom(entity)).toThrowError()
  })

  it("should return null if the component not exists on the entity.", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent<Position>(1)
    const Velocity = engine.defineComponent<Velocity>(2)
    Position.create(entity, { x: 10 })
    expect(Velocity.getOrNull(entity)).toBe(null)
  })

  it("should throw an error if the component class id already exists", () => {
    const engine = Engine()
    const CLASS_ID = 1
    engine.defineComponent<Position>(CLASS_ID)
    const Velocity = () => engine.defineComponent<Velocity>(CLASS_ID)
    expect(Velocity).toThrowError()
  })

  it("should return mutable obj if use component.mutable()", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const CLASS_ID = 1
    const Position = engine.defineComponent<Position>(CLASS_ID)
    Position.create(entity, { x: 10 })
    Position.mutable(entity).x = 8888
    expect(Position.getFrom(entity)).toStrictEqual({ x: 8888 })
  })

  it("should destroy an entity", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const entityB = engine.addEntity() // 0
    const CLASS_ID = 1
    const Position = engine.defineComponent<Position>(CLASS_ID)
    const Velocity = engine.defineComponent<Velocity>(CLASS_ID + 1)
    Position.create(entity, { x: 10 })
    Position.create(entityB, { x: 20 })
    Velocity.create(entity, { y: 20 })

    expect(Position.getOrNull(entity)).toStrictEqual({ x: 10 })
    expect(Velocity.getOrNull(entity)).toStrictEqual({ y: 20 })

    engine.removeEntity(entity)

    expect(Position.getOrNull(entity)).toBe(null)
    expect(Velocity.getOrNull(entity)).toBe(null)
    expect(Position.getOrNull(entityB)).toStrictEqual({ x: 20 })
  })
})
