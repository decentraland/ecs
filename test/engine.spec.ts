import { createVector3, Quaternion, Vector3 } from "../src/built-in-types"
import { Engine } from "../src/engine"

const PositionType = {
  x: Number
}

const VelocityType = {
  y: Number
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
    const Position = engine.defineComponent(1, PositionType)
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
    const Position = engine.defineComponent(1, PositionType)
    const Velocity = engine.defineComponent(2, VelocityType)
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
    const Position = engine.defineComponent(1, PositionType)
    expect(Array.from(Position.dirtyIterator())).toEqual([])
    const posComponent = Position.create(entity, { x: 10 })
    posComponent.x = 1000000000000
    expect(Array.from(Position.dirtyIterator())).toEqual([entity])
    expect(Position.getFrom(entity)).toStrictEqual({ x: 1000000000000 })
  })

  it("should not update a readonly prop groupOf", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent(1, PositionType)
    const posComponent = Position.create(entity, { x: 10 })
    let error
    for (const [entity, position] of engine.groupOf(Position)) {
      try {
        // @ts-ignore
        position.x = 1000000000000
      } catch (_) {
        error = true
      }
    }
    expect(error).toBe(true)
    expect(Position.getFrom(entity)).toStrictEqual({ x: 10 })
  })

  it("should not update a readonly prop getFrom(entity)", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent(1, PositionType)
    const posComponent = Position.create(entity, { x: 10 })
    let error
    try {
      // @ts-ignore
      Position.getFrom(entity).x = 1000000000000
    } catch (_) {
      error = true
    }
    expect(error).toBe(true)
    expect(Position.getFrom(entity)).toStrictEqual({ x: 10 })
  })

  it("should fail if we fetch a component that doesnt exists on an entity", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent(1, PositionType)
    const Velocity = engine.defineComponent(2, VelocityType)
    const posComponent = Position.create(entity, { x: 10 })
    let error
    try {
      // @ts-ignore
      Velocity.getFrom(entity)
    } catch (_) {
      error = true
    }
    expect(error).toBe(true)
  })

  it("should return null if the component not exists on the entity.", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const Position = engine.defineComponent(1, PositionType)
    const Velocity = engine.defineComponent(2, VelocityType)
    const posComponent = Position.create(entity, { x: 10 })
    expect(Velocity.getOrNull(entity)).toBe(null)
  })

  it("should throw an error if the component class id already exists", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const CLASS_ID = 1
    const Position = engine.defineComponent(CLASS_ID, PositionType)
    let error: boolean
    try {
      const Velocity = engine.defineComponent(CLASS_ID, VelocityType)
    } catch (_) {
      error = true
    }
    expect(error).toBe(true)
  })

  it("should return mutable obj if use component.mutable()", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const CLASS_ID = 1
    const Position = engine.defineComponent(CLASS_ID, PositionType)
    Position.create(entity, { x: 10 })
    Position.mutable(entity).x = 8888
    expect(Position.getFrom(entity)).toStrictEqual({ x: 8888 })
  })

  it("should destroy an entity", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const entityB = engine.addEntity() // 0
    const CLASS_ID = 1
    const Position = engine.defineComponent(CLASS_ID, PositionType)
    const Velocity = engine.defineComponent(CLASS_ID + 1, VelocityType)
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

  it("test serializaation", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0

    const Position = engine.defineComponent(1,
      {
        'x': Number,
        'y': Number,
        'z': Number
      }
    )
    const myPosition = Position.create(1, { x: 11, y: 22, z: 33 })

    expect(myPosition.x).toBe(11)
    expect(myPosition.y).toBe(22)
    expect(myPosition.z).toBe(33)
  })

  it("test serializaation 2", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const CLASS_ID = 1

    const Transform = engine.defineComponent(CLASS_ID,
      {
        position: Vector3,
        scale: Vector3,
        rotation: Quaternion
      }
    )
    const myTransform = Transform.create(entity, {
      position: createVector3(1, 2, 3),
      scale: createVector3(4, 5, 6),
      rotation: { ...createVector3(7, 8, 9), w: 10 }
    })
    
    expect(myTransform.position.x).toBe(1)
    expect(myTransform.position.y).toBe(2)
    expect(myTransform.position.z).toBe(3)
    expect(myTransform.scale.x).toBe(4)
    expect(myTransform.scale.y).toBe(5)
    expect(myTransform.scale.z).toBe(6)
    expect(myTransform.rotation.x).toBe(7)
    expect(myTransform.rotation.y).toBe(8)
    expect(myTransform.rotation.z).toBe(9)
    expect(myTransform.rotation.w).toBe(10)
  })

  it("test flex buffers", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const CLASS_ID = 1

    const Transform = engine.defineComponent(CLASS_ID,
      {
        test: Vector3
      }
    )
    const myTransform = Transform.create(entity, {
      test: createVector3(1, 2, 3)
    })


    

  })
})
