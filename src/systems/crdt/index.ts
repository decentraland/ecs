import { Message, crdtProtocol } from '@dcl/crdt'
import type { PreEngine } from '../../engine'
import { Entity } from '../../engine/entity'
import { createByteBuffer } from '../../serialization/ByteBuffer'
import { createTransport } from './transport'
import { parseKey, getKey } from './utils'

/**
 * TODO:
 * What about when we remove the SyncComponent ? Should we notify all the clients? How ?
 * Where do we create the transport and process the received messages?
 */
let i = 0
export function crdtSceneSystem(engine: PreEngine) {
  i++
  const crdtClient = crdtProtocol<Uint8Array>('scene-id-crdt' + i)
  const messages = new Set<Message<Uint8Array>>()
  const transport = createTransport()

  transport.onmessage = (message: MessageEvent<string>) => {
    const msg: Message<Uint8Array> = JSON.parse(message.data)
    msg.data = new Uint8Array(Object.values(msg.data))
    messages.add(msg)
  }

  async function sendMessages(messages: Message<Uint8Array>[]) {
    // TODO create chunk of messages.
    messages.forEach((message) => transport.send(JSON.stringify(message)))
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
        const bb = createByteBuffer()
        bb.writeBuffer(message.data, false)
        componentDefinition.updateFromBinary(entity, bb)
        componentDefinition.clearDirty()
      } else {
        resendMessages.push(msg)
      }
      messages.delete(message)
    }
    sendMessages(resendMessages).catch((e) => console.error(e))
  }

  function processDirtyComponents(dirtyMap: Map<Entity, Set<number>>) {
    const crdtMessages: Message<Uint8Array>[] = []
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
