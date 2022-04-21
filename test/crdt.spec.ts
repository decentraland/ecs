import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { Float32, Int8, MapType } from '../src/built-in-types'
import { Engine } from '../src/engine'
import { ComponentDefinition } from '../src/engine/component'
import { Entity } from '../src/engine/entity'
import * as transport from '../src/systems/crdt/transport'

const Position = {
  id: 88,
  type: MapType({
    x: Float32,
    y: Float32
  })
}

const Door = {
  id: 888,
  type: MapType({
    open: Int8
  })
}

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
  it('should not send static entities, only updates', () => {
    const { engine, spySend } = createSandbox({ length: 1 })[0]
    const entityA = engine.addEntity()
    const { Transform } = engine.baseComponents
    const Test = engine.defineComponent(Position.id, Position.type)

    // Create two basic components for entity A
    Transform.create(entityA, DEFAULT_POSITION)
    Test.create(entityA, { x: 1, y: 2 })

    // Tick update and verify that both messages are being sent through ws.send
    engine.update(1 / 30)
    expect(spySend).toBeCalledTimes(0)

    // Reset ws.send called times
    jest.resetAllMocks()

    Transform.mutable(entityA).position.x = 10
    engine.update(1 / 30)
    expect(spySend).toBeCalledTimes(1)
  })

  it('Send ONLY dirty components via trasnport and spy on send messages', () => {
    const { engine, spySend } = createSandbox({ length: 1 })[0]
    const entityA = engine.addEntity(true)
    const { Transform } = engine.baseComponents
    const Test = engine.defineComponent(Position.id, Position.type)

    // Create two basic components for entity A
    Transform.create(entityA, DEFAULT_POSITION)
    Test.create(entityA, { x: 1, y: 2 })

    // Tick update and verify that both messages are being sent through ws.send
    engine.update(1 / 30)
    expect(spySend).toBeCalledTimes(1)

    // Reset ws.send called times
    jest.resetAllMocks()

    // Update a component and verify that's being sent through the crdt system
    Transform.mutable(entityA).position.x = 10
    engine.update(1 / 30)
    expect(spySend).toBeCalledTimes(1)

    // Reset ws.send again
    jest.resetAllMocks()

    // Call update again with no updates and verify that there's no message
    // being sent through the wire
    engine.update(1 / 30)
    expect(spySend).toBeCalledTimes(0)
  })

  it('should sent new entity through the wire and process it in the other engine', () => {
    const [clientA, clientB] = createSandbox({ length: 2 })

    const entityA = clientA.engine.addEntity(true)
    const { Transform } = clientA.engine.baseComponents
    const TransformB = clientB.engine.baseComponents.Transform
    const TestA = clientA.engine.defineComponent(Position.id, Position.type)
    const TestB = clientB.engine.defineComponent(Position.id, Position.type)

    Transform.create(entityA, DEFAULT_POSITION)
    const DEFAULT_TEST = { x: 10.231231, y: 0.12321321312 }
    TestA.create(entityA, DEFAULT_TEST)

    clientA.engine.update(1 / 30)
    expect(TestB.has(entityA)).toBe(false)

    // Update engine, process crdt messages.
    clientB.engine.update(1 / 30)

    expect(DEFAULT_POSITION).toBeDeepCloseTo(TransformB.getFrom(entityA))
    expect(DEFAULT_TEST).toBeDeepCloseTo(TestB.getFrom(entityA))
    expect(clientA.spySend).toBeCalledTimes(1)
    expect(clientB.spySend).toBeCalledTimes(0)
  })

  it('create multiple clients with the same code. Just like a scene', () => {
    const clients = createSandbox({ length: 2 })
    clients.forEach(({ engine }) => {
      const PosCompomnent = engine.defineComponent(Position.id, Position.type)
      const DoorComponent = engine.defineComponent(Door.id, Door.type)
      const entity = engine.addEntity()

      engine.baseComponents.Transform.create(entity, DEFAULT_POSITION)
      PosCompomnent.create(entity, Vector3.Up())
      DoorComponent.create(entity, { open: 1 })
      engine.update(1 / 30)
      return entity
    })

    clients.forEach((c) => expect(c.spySend).toBeCalledTimes(0))
    /**
     * If we change a static entity in one scene. It should be send to other peers.
     */
    const [clientA, ...otherClients] = clients
    const { Transform } = clientA.engine.baseComponents
    const DoorComponent = clientA.engine.getComponent<typeof Door.type>(Door.id)
    // Upate Transform from static entity
    const entity = (clientA.engine.addEntity() - 1) as Entity
    Transform.mutable(entity).position.x = 10

    // Create a dynamic entity
    const dynamicEntity = clientA.engine.addEntity(true)
    DoorComponent.create(dynamicEntity, { open: 1 })

    clientA.engine.update(1 / 30)

    otherClients.forEach((client) => {
      client.engine.update(1 / 30)
      const { Transform } = client.engine.baseComponents
      const DoorComponent = client.engine.getComponent(Door.id)

      expect(client.spySend).toBeCalledTimes(0)
      expect(Transform.getFrom(entity).position.x).toBe(10)
      expect(DoorComponent.getFrom(dynamicEntity)).toStrictEqual({ open: 1 })
    })
  })
})
