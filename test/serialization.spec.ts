import {
  ArrayType,
  EcsType,
  Float32,
  Float64,
  Int16,
  Int32,
  Int64,
  Int8,
  MapType,
  String
} from '../src/built-in-types'
import { Engine } from '../src/engine'
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to'
expect.extend({ toBeDeepCloseTo, toMatchCloseTo })

const Vector3 = MapType({ x: Float32, y: Float32, z: Float32 })
const Quaternion = MapType({ x: Float32, y: Float32, z: Float32, w: Float32 })
const Transform = MapType({
  position: Vector3,
  rotation: Quaternion,
  scale: Vector3
})

describe('Engine tests', () => {
  it('should serialize and parse ints and be equal', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()
    const toTest = [Int16, Int32, Int8]
    let CLASS_ID = 888

    for (const t of toTest) {
      const IntegerComponent = engine.defineComponent(
        CLASS_ID++,
        MapType({ value: t })
      )
      const myInteger = IntegerComponent.create(entity, { value: 33 })
      expect(myInteger.value).toBe(33)

      const buffer = IntegerComponent.toBinary(entity)
      const copiedInteger = IntegerComponent.create(entityCopied, { value: 21 })
      expect(copiedInteger.value).toBe(21)
      const updatedInteger = IntegerComponent.updateFromBinary(
        entityCopied,
        buffer
      )
      expect(updatedInteger.value).toBe(33)
    }
  })

  it('should serialize and parse floats and be equal', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()
    const toTest = [Float32, Float64]
    let CLASS_ID = 888
    const testValue = 2.0

    for (const t of toTest) {
      const FloatComponent = engine.defineComponent(
        CLASS_ID++,
        MapType({ value: t })
      )
      const myFloat = FloatComponent.create(entity, { value: testValue })
      expect(myFloat.value).toBe(testValue)

      const buffer = FloatComponent.toBinary(entity)
      const copiedFloat = FloatComponent.create(entityCopied, { value: 21.22 })
      expect(copiedFloat.value).toBe(21.22)
      const updatedFloat = FloatComponent.updateFromBinary(entityCopied, buffer)
      expect(updatedFloat.value).toBe(testValue)
    }
  })

  it('should serialize and parse an string and be equal', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()

    let CLASS_ID = 888
    const testValue = 'testing an string'

    const FloatComponent = engine.defineComponent(
      CLASS_ID++,
      MapType({ value: String })
    )
    const myFloat = FloatComponent.create(entity, { value: testValue })
    expect(myFloat.value).toBe(testValue)

    const buffer = FloatComponent.toBinary(entity)
    const copiedFloat = FloatComponent.create(entityCopied, { value: 'n' })
    expect(copiedFloat.value).toBe('n')
    const updatedFloat = FloatComponent.updateFromBinary(entityCopied, buffer)
    expect(updatedFloat.value).toBe(testValue)
  })

  it('should serialize and parse a complex object, modify and be equal', () => {
    const engine = Engine()
    const myEntity = engine.addEntity()
    const CLASS_ID = 888

    const ItemType = MapType({
      itemId: Int32,
      name: String,
      enchantingIds: ArrayType(
        MapType({
          itemId: Int32,
          itemAmount: Int32,
          description: String
        })
      )
    })

    const PlayerComponent = engine.defineComponent(
      CLASS_ID,
      MapType({
        name: String,
        description: String,
        level: Int32,
        hp: Float32,
        position: Vector3,
        transform: Transform,
        targets: ArrayType(Vector3),
        items: ArrayType(ItemType)
      })
    )

    const defaultPlayer = {
      name: '',
      description: '',
      level: 1,
      hp: 0.0,
      position: { x: 1.0, y: 50.0, z: 50.0 },
      transform: {
        position: { x: 11.11, y: 22.222, z: 33.33 },
        scale: { x: 44.44, y: 55.55, z: 66.66 },
        rotation: { x: 77.77, y: 88.88, z: 99.99, w: 110.11011 }
      },
      targets: [],
      items: []
    }

    const myPlayer = PlayerComponent.create(myEntity, defaultPlayer)

    expect(PlayerComponent.getFrom(myEntity)).toStrictEqual(defaultPlayer)

    myPlayer.hp = 8349.2
    myPlayer.position.x += 1.0
    myPlayer.targets.push({
      x: 1232.3232,
      y: Math.random() * 33,
      z: 8754.32723
    })
    myPlayer.items.push({
      itemId: 1,
      name: 'Manzana roja',
      enchantingIds: []
    })
    myPlayer.items[0]?.enchantingIds.push({
      itemId: 2,
      itemAmount: 10,
      description: 'this is a description to an enchanting item.'
    })

    const buffer = PlayerComponent.toBinary(myEntity)

    const otherEntity = engine.addEntity()

    PlayerComponent.create(otherEntity, defaultPlayer)
    PlayerComponent.updateFromBinary(otherEntity, buffer)

    const originalPlayer = PlayerComponent.getFrom(myEntity)
    const modifiedFromBinaryPlayer = PlayerComponent.getFrom(otherEntity)
    expect(modifiedFromBinaryPlayer).toBeDeepCloseTo(originalPlayer)
  })

  it('copy component from binary deco/encode', () => {
    const engine = Engine()
    const entityFilled = engine.addEntity() // 0
    const entityEmpty = engine.addEntity() // 1
    const CLASS_ID = 888

    const TestComponentType = engine.defineComponent(
      CLASS_ID,
      MapType({
        a: Int32,
        b: Int32,
        c: ArrayType(Int32),
        d: Int64
      })
    )
    const myComponent = TestComponentType.create(entityFilled, {
      a: 2331,
      b: 10,
      c: [2, 3, 4, 5],
      d: BigInt(-1)
    })

    TestComponentType.create(entityEmpty, {
      a: 0,
      b: 0,
      c: [],
      d: BigInt(10)
    })

    const buffer = TestComponentType.toBinary(entityFilled)
    TestComponentType.updateFromBinary(entityEmpty, buffer)

    const modifiedComponent = TestComponentType.getFrom(entityEmpty)
    expect(modifiedComponent.a).toBe(myComponent.a)
    expect(modifiedComponent.b).toBe(myComponent.b)
    expect(modifiedComponent.c).toEqual(myComponent.c)
    expect(modifiedComponent.d).toEqual(myComponent.d)
  })

  it('copy component from binary deco/encode', () => {
    const engine = Engine()
    const entity = engine.addEntity()
    const entityCopied = engine.addEntity()

    let i = 0
    const A = 'abcdefghijkl'
    const vectorType: Record<string, EcsType<number>> = {}
    const objectValues: Record<string, number> = {}
    const zeroObjectValues: Record<string, number> = {}

    for (i = 0; i < A.length; i++) {
      const CLASS_ID = 888 + i + 1
      const key = A[i]
      vectorType[key] = Int32
      objectValues[key] = 50 + i
      zeroObjectValues[key] = 0
      const TestComponentType = engine.defineComponent(
        CLASS_ID,
        MapType(vectorType)
      )

      TestComponentType.create(entity, objectValues)
      TestComponentType.create(entityCopied, zeroObjectValues)
      const buffer = TestComponentType.toBinary(entity)
      TestComponentType.updateFromBinary(entityCopied, buffer)
      expect(TestComponentType.getFrom(entity)).toStrictEqual(
        TestComponentType.getFrom(entityCopied)
      )
    }
  })

  it('force encode float struct of transform', () => {
    const engine = Engine()
    const entity = engine.addEntity() // 0
    const CLASS_ID = 888

    const TransformComponent = engine.defineComponent(CLASS_ID, Transform)
    const _myTransform = TransformComponent.create(entity, {
      position: { x: 111.1, y: 222.22, z: 333.33 },
      scale: { x: 41213.2, y: 5.214, z: 6112.1 },
      rotation: { x: 711.1, y: 8121.2, z: 9.21, w: 10.221 }
    })

    const buffer = TransformComponent.toBinary(entity)
    expect(buffer.size()).toBe(40)
    expect(Array.from(buffer.toBinary())).toStrictEqual([
      66, 222, 51, 51, 67, 94, 56, 82, 67, 166, 170, 61, 68, 49, 198, 102, 69,
      253, 201, 154, 65, 19, 92, 41, 65, 35, 137, 55, 71, 32, 253, 51, 64, 166,
      217, 23, 69, 191, 0, 205
    ])
  })
})
