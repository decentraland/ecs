import crdt, { Message } from '@dcl/crdt'
import type { PreEngine } from '../../engine'
import { Entity } from '../../engine/entity'
import { parseKey, getKey } from './utils'

/**
 * TODO:
 * What about when we remove the SyncComponent ? Should we notify all the clients? How ?
 * Where do we create the transport and process the received messages?
 */
export function crdtSceneSystem(engine: PreEngine) {
  const entitiesSynced: Set<Entity> = new Set()
  async function sendMessage() {}
  const crdtClient = crdt.crdtProtocol<Uint8Array>(sendMessage, 'scene-id-crdt')
  const messages = new Set<Message<Uint8Array>>()

  const ws = new WebSocket('ws://localhost:8000')
  ws.onmessage = (message: MessageEvent<Message<Uint8Array>>) => {
    messages.add(message.data)
  }

  async function sendMessages(messages: crdt.Message<Uint8Array>[]) {
    for (const message of messages) {
      const [_entityId, _componentId] = parseKey(message.key)
      console.log('SendMEssage', message)
      // catch sendMessage Error
      // engine.getComponent(componentId)
      /**
       *  Renderer <--> Scene => Only Class ID. SynchronizedEntityType.Renderer
       *  Scene <--> Scene => Only Sync component. SynchronizedEntityType.Networked
       *  Scene <--> Editor => All. SynchronizedEntityType.All
       * */
    }
  }

  function processMessages() {
    for (const message of messages) {
      const [entity, classId] = parseKey(message.key)
      void crdtClient.processMessage(message)
      if (crdtClient.getState()[message.key]?.data === message.data) {
        // We need to update the component state
        engine.getComponent(classId)?.updateFromBinary(entity, message.data)
        engine.getComponent(classId)?.clearDirty()
        // TODO this should remove the dirty
      }
    }
  }

  function processDirtyComponents(dirtyEntities: Entity[]) {
    const crdtMessages: crdt.Message<Uint8Array>[] = []
    for (const entity of dirtyEntities) {
      entitiesSynced.add(entity)
      for (const component of engine.getEntityComponents(entity)) {
        if (!component.isDirty(entity)) {
          continue
        }
        const key = getKey(entity, component._id)
        const event = crdtClient.createEvent(
          key,
          component.getFrom(entity)!.toBinary()
        )
        // void sendMessage(event)
        crdtMessages.push(event)
      }
    }
    void sendMessages(crdtMessages)
  }
  return {
    processDirtyComponents,
    processMessages
  }
}

// const { Sync } = engine.baseComponents
// for (const [entity] of engine.groupOf(Dirty)) {
//   const components = engine.getEntityComponents(entity)
//   for (const p of )
// }

// for (const [entity] of engine.mutableGroupOf(Sync)) {
//   for (const component of engine.getEntityComponents(entity)) {
//     // If its a new entity, we should send all the components.
//     // Otherwise, we send only the updates (dirty)
//     if (!entitiesMap.has(entity) || component.isDirty(entity)) {
//       const event = crdtClient.createEvent(
//         getKey(entity, component._id),
//         component.toBinary(entity)
//       )
//       void crdtClient.sendMessage(event)
//       return
//     }
//   }
//   entitiesMap.add(entity)
// }
