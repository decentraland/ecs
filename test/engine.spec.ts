import { builder, toReference } from "../../flatbuffers/js/flexbuffers"
import { ArrayType, Float, Int32, MapType, Quaternion, Vector3, String, EcsType } from "../src/built-in-types"
import { Engine } from "../src/engine"

const PositionType = {
  x: Float
}

const VelocityType = {
  y: Float
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

  it("component with simple data", () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0

    const Position = engine.defineComponent(1,
      {
        'x': Float,
        'y': Float,
        'z': Float
      }
    )
    const myPosition = Position.create(1, { x: 11, y: 22, z: 33 })

    expect(myPosition.x).toBe(11)
    expect(myPosition.y).toBe(22)
    expect(myPosition.z).toBe(33)
  })

  it("component with complex data", () => {
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
      position: { x: 1, y: 2, z: 3 },
      scale: { x: 4, y: 5, z: 6 },
      rotation: { x: 7, y: 8, z: 9, w: 10 },
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

  it("component with very complex data", () => {
    const engine = Engine()
    const myEntity = engine.addEntity()
    const CLASS_ID = 1

    const ItemType =
      MapType({
        itemId: Int32,
        name: String,
        enchantingIds: ArrayType(MapType({
          itemId: Int32,
          itemAmount: Int32
        }))
      })

    const PlayerComponent = engine.defineComponent(CLASS_ID,
      {
        name: String,
        level: Int32,
        hp: Float,
        position: Vector3,
        targets: ArrayType(Vector3),
        items: ArrayType((ItemType))
      }
    )

    const defaultPlayer = {
      name: '',
      level: 1,
      hp: 0.0,
      position: { x: 1, y: 50, z: 50 },
      targets: [],
      items: []
    }

    const myPlayer = PlayerComponent.create(myEntity, defaultPlayer)
    expect(PlayerComponent.getFrom(myEntity)).toStrictEqual(defaultPlayer)

    myPlayer.position.x += 1.0
    myPlayer.items.push({
      itemId: 1,
      name: 'Manzana roja',
      enchantingIds: []
    })
    myPlayer.items[0]?.enchantingIds.push({
      itemId: 2,
      itemAmount: 10
    })


    const buffer = PlayerComponent.toBinary(myEntity)
    console.log({ playerBinary: buffer })

    const otherEntity = engine.addEntity()

    PlayerComponent.create(otherEntity, defaultPlayer)
    PlayerComponent.updateFromBinary(otherEntity, buffer, 0)

    const originalPlayer = PlayerComponent.getFrom(myEntity)
    const modifiedFromBinaryPlayer = PlayerComponent.getFrom(otherEntity)
    expect(modifiedFromBinaryPlayer).toStrictEqual(originalPlayer)
  })

  it("copy component from binary deco/encode", () => {
    const engine = Engine()
    const entityFilled = engine.addEntity() // 0
    const entityEmpty = engine.addEntity() // 1
    const CLASS_ID = 1

    const TestComponentType = engine.defineComponent(CLASS_ID,
      {
        a: Int32,
        b: Int32,
        c: ArrayType(Int32)
      }
    )
    const myComponent = TestComponentType.create(entityFilled, {
      a: 2331,
      b: 10,
      c: [2, 3, 4, 5]
    })

    TestComponentType.create(entityEmpty, {
      a: 0,
      b: 0,
      c: []
    })

    // console.log(TestComponentType.toBinary(entityFilled))

    const buffer = TestComponentType.toBinary(entityFilled)
    TestComponentType.updateFromBinary(entityEmpty, buffer, 0)

    const modifiedComponent = TestComponentType.getFrom(entityEmpty)
    expect(modifiedComponent.a).toBe(myComponent.a)
    expect(modifiedComponent.b).toBe(myComponent.b)
    expect(modifiedComponent.c).toEqual(myComponent.c)
  })

  it("copy component from binary deco/encode", () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()

    let i = 0
    const A = 'abcdefghijkl'
    const vectorType: Record<string, EcsType<number>> = {}
    const objectValues: Record<string, number> = {}
    const zeroObjectValues: Record<string, number> = {}

    for (i = 0; i < A.length; i++) {
      const CLASS_ID = i + 1
      const key = A[i]
      vectorType[key] = Int32
      objectValues[key] = 50 + i
      zeroObjectValues[key] = 0
      const TestComponentType = engine.defineComponent(CLASS_ID, vectorType)

      TestComponentType.create(entity, objectValues)
      TestComponentType.create(entityCopied, zeroObjectValues)
      const buffer = TestComponentType.toBinary(entity)
      // console.log({
      //   elements: i + 1,
      //   buffer
      // })

      TestComponentType.updateFromBinary(entityCopied, buffer, 0)
      expect(TestComponentType.getFrom(entity)).toStrictEqual(TestComponentType.getFrom(entityCopied))
    }

  })

  // it("test flexbuffer", () => {
  //   const fbb = builder()
  //   fbb.startVector()
  //   fbb.add
  //   fbb.addInt(50)
  //   fbb.addInt(51)
  //   fbb.addInt(52)
  //   fbb.addInt(53)
  //   fbb.end()

  //   const serializedBuffer = fbb.finish()
  //   expect(serializedBuffer).toStrictEqual(new Uint8Array([50, 51, 52, 53, 4, 88, 1]))

  //   const ref = toReference(serializedBuffer.buffer)
  //   expect(ref.length()).toBe(4)
  //   expect(ref.get(0).intValue()).toBe(50)
  //   expect(ref.get(1).intValue()).toBe(51)
  //   expect(ref.get(2).intValue()).toBe(52)
  //   expect(ref.get(3).intValue()).toBe(53)
  // })

})
