import { Message, crdtProtocol } from '@dcl/crdt'
import type { PreEngine } from '../../engine'
import { Entity } from '../../engine/entity'
import { createByteBuffer } from '../../serialization/ByteBuffer'
import {
  readPutComponentOperationWithoutData,
  writePutComponent
} from '../../serialization/crdt/ComponentOperation'
import { createTransport } from './transport'
import { parseKey, getKey } from './utils'

/**
 * TODO:
 * What about when we remove the SyncComponent ? Should we notify all the clients? How ?
 * Where do we create the transport and process the received messages?
 */
export function crdtSceneSystem(engine: PreEngine) {
  const crdtClient = crdtProtocol<Uint8Array>('scene-id-crdt')
  const messages = new Set<Message<Uint8Array>>()
  const transport = createTransport()

  transport.onmessage = (chunkMessage: MessageEvent<Uint8Array>) => {
    if (!chunkMessage.data?.length) return

    const buffer = createByteBuffer({
      reading: { buffer: chunkMessage.data, currentOffset: 0 }
    })

    const message = readPutComponentOperationWithoutData(buffer)
    if (!message) return
    const { entityId, componentClassId, data, timestamp } = message
    messages.add({ key: getKey(entityId, componentClassId), data, timestamp })
  }
  /**
   * This messages will be processed on every tick.
   */
  function processMessages() {
    const resendMessages: Message<Uint8Array>[] = []
    const messagesToProcess = Array.from(messages)

    for (const message of messagesToProcess) {
      const [entity, classId] = parseKey(message.key)
      const msg = crdtClient.processMessage(message)
      if (msg === message) {
        const componentDefinition = engine.getComponent(classId)
        if (!componentDefinition) {
          throw new Error(
            'Component not found. You need to declare the components at the beginnig of the engine declaration'
          )
        }
        if (!componentDefinition.has(entity)) {
          componentDefinition.create(entity, {})
        }
        // TODO: lean
        const bb = createByteBuffer({
          reading: { buffer: message.data, currentOffset: 0 }
        })
        console.log(bb.toBinary())
        componentDefinition.updateFromBinary(entity, bb)
        componentDefinition.clearDirty()
      } else {
        resendMessages.push(msg)
      }
      messages.delete(message)
    }
    // sendMessages(resendMessages).catch((e) => console.error(e))
  }

  function send(dirtyMap: Map<Entity, Set<number>>) {
    const buffer = createByteBuffer()

    for (const [entity, componentsId] of dirtyMap) {
      for (const componentId of componentsId) {
        const component = engine.componentsDefinition.get(componentId)
        if (!component) {
          throw new Error('Component not found')
        }
        const key = getKey(entity, componentId)
        const event = crdtClient.createEvent(
          key,
          component.toBinary(entity).toBinary()
        )
        writePutComponent(entity, event.timestamp + 10, component, buffer)
      }
    }
    transport.send(buffer.toBinary())
  }

  return {
    send,
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
