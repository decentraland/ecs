import { Message } from '@dcl/crdt'
import { Float32, MapType } from '../src/built-in-types'
import { Engine } from '../src/engine'
import * as transport from '../src/systems/crdt/transport'
import { getKey } from '../src/systems/crdt/utils'

const TestType = MapType({
  x: Float32,
  y: Float32
})

describe('CRDT tests', () => {
  it('Send dirty components via trasnport and spy on send messages', () => {
    // Mock WS so we can spy on ws.send
    const ws = new globalThis.WebSocket('')
    ws.send = jest.fn()
    jest.spyOn(transport, 'createTransport').mockReturnValue(ws)

    // Create engine with Test and Trasnform components
    const engine = Engine()
    const entityA = engine.addEntity()
    const { Transform } = engine.baseComponents
    const Test = engine.defineComponent(88, TestType)

    // Create two basic components for entity A
    Transform.create(entityA, {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 1, y: 1, z: 1, w: 1 },
      scale: { x: 2, y: 2, z: 2 }
    })
    Test.create(entityA, { x: 1, y: 2 })

    // Tick update and verify that both messages are being sent through ws.send
    engine.update(1 / 30)
    const transformCRDT: Message<Uint8Array> = {
      key: getKey(entityA, Transform._id),
      data: Transform.toBinary(entityA),
      timestamp: 1
    }
    const testCRDT: Message<Uint8Array> = {
      key: getKey(entityA, Test._id),
      data: Test.toBinary(entityA),
      timestamp: 1
    }
    expect(ws.send).toBeCalledWith(JSON.stringify(transformCRDT))
    expect(ws.send).toBeCalledWith(JSON.stringify(testCRDT))

    // Reset ws.send called times
    jest.resetAllMocks()

    // Update a component and verify that's being sent through the crdt system
    Transform.mutable(entityA).position.x = 10
    engine.update(1 / 30)
    const transformCRDT2: Message<Uint8Array> = {
      key: getKey(entityA, Transform._id),
      data: Transform.toBinary(entityA),
      timestamp: 2
    }
    expect(ws.send).toBeCalledWith(JSON.stringify(transformCRDT2))

    // Reset ws.send again
    jest.resetAllMocks()

    // Call update again with no updates and verify that there's no message
    // being sent through the wire
    engine.update(1 / 30)
    expect(ws.send).toBeCalledTimes(0)
  })
})
