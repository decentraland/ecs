import { Engine } from '../src/engine'
import { addComponentsToEngine as addExternalComponents } from '../src/external-components'

type Position = {
  x: number
}

type Velocity = {
  y: number
}

describe("unit", () => {
  it("smoke test", () => {
    const engine = Engine()
    const entityA = engine.addEntity()
    const Pos = engine.defineComponent<Position>(1)
    const Vel = engine.defineComponent<Velocity>(2)
    const position = Pos.create(entityA, { x: 1 })
    const velocity = Vel.create(entityA, { y: 10 })
    expect(position).toStrictEqual({ x: 1 })
    expect(velocity).toStrictEqual({ y: 10 })

    const positionMutable = Pos.mutable(entityA)
    positionMutable.x = 2
    expect(Pos.getFrom(entityA)).toStrictEqual({ x: 2 })

    for (const [entity, position] of engine.mutableGroupOf(Pos)) {
      expect(entity).toBe(entityA)
      expect(position).toStrictEqual({ x: 2 })
      position.x = Vel.getFrom(entity).y
    }
    expect(Pos.getFrom(entityA)).toStrictEqual({ x: 10 })

    for (const [entity, position] of engine.groupOf(Pos)) {
      expect(entity).toBe(entityA)
      try {
        // @ts-expect-error
        position.x = 8888888888
      } catch(_) {}
      expect(Pos.getFrom(entity)).toStrictEqual({ x: 10 })
    }

    const { Position } = addExternalComponents(engine)
    const entityB = engine.addEntity()
    const externalPos = Position.create(entityA, { x: 80 })
    const externalPos2 = Position.create(entityB, { x: 20 })

    for (const [entity, position] of engine.groupOf(Position)) {
      if (entity === entityA) {
        expect(Position.getFrom(entity)).toStrictEqual({ x: 80 })
      } else {
        expect(Position.getFrom(entity)).toStrictEqual({ x: 20 })
      }
    }
    const components = engine.groupOf(Position)
    expect([...components]).toEqual([[entityA, { x: 80 } ], [entityB, { x: 20 } ]])
  })
})
