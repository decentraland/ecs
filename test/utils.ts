import { Quaternion, Vector3 } from '@dcl/ecs-math'

import { Float32, Int8, MapType } from '../src/built-in-types'
import { Engine } from '../src/engine'
import * as transport from '../src/systems/crdt/transport'

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
}

export namespace SandBox {
  export const WS_SEND_DELAY = 30
  export const Position = { id: 88, type: MapType({ x: Float32, y: Float32 }) }
  export const Door = { id: 888, type: MapType({ open: Int8 }) }

  export const DEFAULT_POSITION = {
    position: Vector3.create(0, 1, 2),
    scale: Vector3.One(),
    rotation: Quaternion.Identity()
  }

  /**
   * Mock websocket transport so we can fake communication
   * between two engines. WebSocket A <-> WebSocket B
   */
  export function create({ length }: { length: number }) {
    const clients = Array.from({ length }).map((_, index) => {
      const ws = new globalThis.WebSocket(`ws://url-${index}`)
      jest.spyOn(transport, 'createTransport').mockReturnValue(ws)
      const engine = Engine()

      const Position = engine.defineComponent(
        SandBox.Position.id,
        SandBox.Position.type
      )
      const Door = engine.defineComponent(SandBox.Door.id, SandBox.Door.type)

      return {
        id: index,
        engine,
        ws,
        components: { Door, Position }
      }
    })

    // Broadcast between clients
    clients.forEach((client) => {
      client.ws.send = (data) => {
        clients.forEach(async (c) => {
          await wait(WS_SEND_DELAY)
          c.id !== client.id && c.ws.onmessage!({ data } as MessageEvent)
        })
      }
    })

    return clients.map((c) => ({ ...c, spySend: jest.spyOn(c.ws, 'send') }))
  }
}