import crdt from '@dcl/crdt'
import type { Engine } from '../engine'
import { Entity } from '../engine/entity'

async function sendUpdates(message: crdt.Message) {
  console.log(message)
  return
}

/**
 * TODO:
 * What about when we remove the SyncComponent ? Should we notify all the clients? How ?
 * Where do we create the transport and process the received messages?
 */
export default function createSystem(engine: ReturnType<typeof Engine>) {
  const entitiesMap: Set<Entity> = new Set()
  const crdtClient = crdt.crdtProtocol<Uint8Array>(sendUpdates, 'scene-id-crdt')

  /**
   * const serv = new WebSocket('wss://TODO???')
   * serv.on('message', () => {
   *  const event = crdt.processMessage()
   *  engine.getComponent(event.classId).updateFrom(event.entityId, event.data) ?
   * })
   */

  return function (_dt: number) {
    const { Sync } = engine.baseComponents
    for (const [entity] of engine.mutableGroupOf(Sync)) {
      for (const component of engine.getEntityComponents(entity)) {
        // If its a new entity, we should send all the components.
        // Otherwise, we send only the updates (dirty)
        if (!entitiesMap.has(entity) || component.isDirty(entity)) {
          const event = crdtClient.createEvent(
            `${entity}.${component._id}`,
            component.toBinary(entity)
          )
          crdtClient.sendMessage(event)
          return
        }
      }
      entitiesMap.add(entity)
    }
  }
}
