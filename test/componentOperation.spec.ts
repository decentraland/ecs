import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to'
import { Engine } from '../src/engine'
import { createByteBuffer } from '../src/serialization/ByteBuffer'
import { PutComponentOperation } from '../src/serialization/crdt/componentOperation'
import WireMessage from '../src/serialization/wireMessage'

expect.extend({ toBeDeepCloseTo, toMatchCloseTo })

describe('Component operation tests', () => {
  it('validate corrupt message', () => {
    const buf = createByteBuffer({
      reading: {
        buffer: new Uint8Array([
          255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255
        ]),
        currentOffset: 0
      }
    })

    expect(WireMessage.validate(buf)).toBe(false)
  })

  it('serialize and process a PutComenentOperation', () => {
    const newEngine = Engine()
    const sdk = newEngine.baseComponents
    const entityId = newEngine.addEntity()
    sdk.Transform.create(entityId, {
      position: Vector3.create(1, 1, 1),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(1, 1, 1, 1)
    })

    const bb = createByteBuffer()
    PutComponentOperation._writePutComponent(
      entityId,
      1,
      sdk.Transform._id,
      sdk.Transform.toBinary(entityId).toBinary(),
      bb
    )
  })

  it('serialize and process two PutComenentOperation message', () => {
    const newEngine = Engine()
    const sdk = newEngine.baseComponents
    const entityId = newEngine.addEntity()
    const entityId2 = newEngine.addEntity()

    let timestamp = 1

    const mutableTransform = sdk.Transform.create(entityId, {
      position: Vector3.create(1, 1, 1),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(1, 1, 1, 1)
    })

    const bb = createByteBuffer()

    PutComponentOperation.write(entityId, timestamp, sdk.Transform, bb)

    mutableTransform.position.x = 31.3
    timestamp++

    PutComponentOperation.write(entityId, timestamp, sdk.Transform, bb)

    while (WireMessage.validate(bb)) {
      const msgOne = PutComponentOperation.read(bb)
      expect(msgOne.version).toBe(WireMessage.HEADER_CURRENT_VERSION)
      expect(msgOne.length).toBe(40 + PutComponentOperation.MESSAGE_LENGTH)
      expect(msgOne.type).toBe(WireMessage.Enum.PUT_COMPONENT)
      const component = sdk.Transform.updateOrCreateFromBinary(entityId2, bb)
      console.log({ component })
    }
  })
})
