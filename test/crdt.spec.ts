import { Message } from '@dcl/crdt'
import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { Float32, MapType } from '../src/built-in-types'
import { Engine } from '../src/engine'
import * as transport from '../src/systems/crdt/transport'
import CrdtUtils from '../src/systems/crdt/utils'

const TestType = MapType({
  x: Float32,
  y: Float32
})

const DEFAULT_POSITION = {
  position: Vector3.create(0, 1, 2),
  scale: Vector3.One(),
  rotation: Quaternion.Identity()
}

/**
 * Mock websocket transport so we can fake communication
 * between two engines. WebSocket A <-> WebSocket B
 */
function createSandbox({ length }: { length: number }) {
  const clients = Array.from({ length }).map((_, index) => {
    const ws = new globalThis.WebSocket(`ws://url-${index}`)
    jest.spyOn(transport, 'createTransport').mockReturnValue(ws)
    const engine = Engine()
    return {
      id: index,
      engine,
      ws
    }
  })

  // Broadcast between clients
  clients.forEach((client) => {
    client.ws.send = (data) => {
      clients.forEach(
        (c) => c.id !== client.id && c.ws.onmessage({ data } as MessageEvent)
      )
    }
  })

  return clients.map((c) => ({ ...c, spySend: jest.spyOn(c.ws, 'send') }))
}

describe('CRDT tests', () => {
  it('Send dirty components via trasnport and spy on send messages', () => {
    const { engine, ws, spySend } = createSandbox({ length: 1 })[0]
    const entityA = engine.addEntity()
    const { Transform } = engine.baseComponents
    const Test = engine.defineComponent(88, TestType)

    // Create two basic components for entity A
    Transform.create(entityA, DEFAULT_POSITION)
    Test.create(entityA, { x: 1, y: 2 })

    // Tick update and verify that both messages are being sent through ws.send
    engine.update(1 / 30)
    const transformCRDT: Message<Uint8Array> = {
      key: CrdtUtils.getKey(entityA, Transform._id),
      data: Transform.toBinary(entityA).toBinary(),
      timestamp: 1
    }
    const testCRDT: Message<Uint8Array> = {
      key: CrdtUtils.getKey(entityA, Test._id),
      data: Test.toBinary(entityA).toBinary(),
      timestamp: 1
    }
    expect(spySend).toBeCalledWith(JSON.stringify(transformCRDT))
    expect(spySend).toBeCalledWith(JSON.stringify(testCRDT))

    // Reset ws.send called times
    jest.resetAllMocks()

    // Update a component and verify that's being sent through the crdt system
    Transform.mutable(entityA).position.x = 10
    engine.update(1 / 30)
    const transformCRDT2: Message<Uint8Array> = {
      key: CrdtUtils.getKey(entityA, Transform._id),
      data: Transform.toBinary(entityA).toBinary(),
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

  it.only('should sent new entity through the wire and process it in the other engine', () => {
    const [clientA, clientB] = createSandbox({ length: 2 })

    clientA.engine.addEntity()
    const entityA = clientA.engine.addEntity()
    const { Transform } = clientA.engine.baseComponents

    Transform.create(entityA, DEFAULT_POSITION)
    console.log(Transform.toBinary(entityA).toBinary())
    clientA.engine.update(1 / 30)
    clientB.engine.update(1 / 30)

    const bTransform = clientB.engine.baseComponents.Transform.getFrom(entityA)
    expect(DEFAULT_POSITION).toStrictEqual(bTransform)
    expect(clientA.spySend).toBeCalledTimes(1)
    expect(clientB.spySend).toBeCalledTimes(0)
  })
})
