import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to'
import { Engine } from '../src/engine'
import { createByteBuffer } from '../src/serialization/ByteBuffer'
import {
  COMPONENT_OPERATION_LENGTH,
  writePutComponent,
  readPutOperation,
  _writePutComponent
} from '../src/serialization/crdt/ComponentOperation'
import {
  MessageType,
  MESSAGE_HEADER_CURRENT_VERSION,
  validateIncommingWireMessage,
  writeMessageWithCbToBuffer
} from '../src/serialization/WireMessage'
expect.extend({ toBeDeepCloseTo, toMatchCloseTo })

describe('Component operation tests', () => {
  it('serialize a generic WireMessage', () => {
    const buf = createByteBuffer()

    expect(validateIncommingWireMessage(buf)).toBe(false)
    writeMessageWithCbToBuffer((buf) => {
      buf.writeInt8(100)
      return 0
    }, buf)
    expect(validateIncommingWireMessage(buf)).toBe(true)
  })

  it('validate corrupt message', () => {
    const buf = createByteBuffer({
      reading: {
        buffer: new Uint8Array([
          255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255
        ]),
        currentOffset: 0
      }
    })

    expect(validateIncommingWireMessage(buf)).toBe(false)
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
    _writePutComponent(
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

    writePutComponent(entityId, timestamp, sdk.Transform, bb)

    mutableTransform.position.x = 31.3
    timestamp++

    writePutComponent(entityId, timestamp, sdk.Transform, bb)

    while (validateIncommingWireMessage(bb)) {
      const msgOne = readPutOperation(bb)
      expect(msgOne.version).toBe(MESSAGE_HEADER_CURRENT_VERSION)
      expect(msgOne.length).toBe(40 + COMPONENT_OPERATION_LENGTH)
      expect(msgOne.type).toBe(MessageType.PUT_COMPONENT)
      const component = sdk.Transform.updateOrCreateFromBinary(entityId2, bb)
      console.log({ component })
    }
  })
})
