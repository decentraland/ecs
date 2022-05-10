import { Message, crdtProtocol } from '@dcl/crdt'

import type { PreEngine } from '../../engine'
import { Entity } from '../../engine/entity'
import EntityUtils from '../../engine/entity-utils'
import { createByteBuffer } from '../../serialization/ByteBuffer'
import { PutComponentOperation } from '../../serialization/crdt/componentOperation'
import WireMessage from '../../serialization/wireMessage'
import { createTransport } from './transport'
import CrdtUtils from './utils'

/**
 * TODO:
 * What about when we remove the SyncComponent ? Should we notify all the clients? How ?
 * Where do we create the transport and process the received messages?
 */
export function crdtSceneSystem(engine: PreEngine) {
  // CRDT client
  const crdtClient = crdtProtocol<Uint8Array>()
  // Queue of messages to be proccessed at next tick
  const messages: Message<Uint8Array>[] = []
  // Entities already processed by crdt
  const crdtEntities = new Map<Entity, boolean>()

  const transport = createTransport({ onData: parseChunkMessage })

  /**
   * Receives a chunk of binary messages and stores all the valid
   * Component Operation Messages at messages queue
   * @param chunkMessage A chunk of binary messages
   */
  function parseChunkMessage(chunkMessage: MessageEvent<Uint8Array>) {
    if (!chunkMessage.data?.length) return

    const buffer = createByteBuffer({
      reading: { buffer: chunkMessage.data, currentOffset: 0 }
    })

    while (WireMessage.validate(buffer)) {
      const message = PutComponentOperation.read(buffer)!

      const { entityId, componentId, data, timestamp } = message
      messages.push({
        key: CrdtUtils.getKey(entityId, componentId),
        data,
        timestamp
      })
    }
  }

  /**
   * Return and clear the messaes queue
   * @returns messages recieved by the transport to process on the next tick
   */
  function getMessages() {
    const messagesToProcess = Array.from(messages)
    messages.length = 0
    return messagesToProcess
  }

  /**
   * This fn will be called on every tick.
   * Process all the messages queue received by the transport
   */
  function processMessages() {
    const buffer = createByteBuffer()
    const messagesToProcess = getMessages()

    for (const message of messagesToProcess) {
      const [entity, componentId] = CrdtUtils.parseKey(message.key)
      const component = engine.getComponent(componentId)
      const msg = crdtClient.processMessage(message)

      // CRDT outdated message. Resend this message through the wire
      // TODO: perf transactor
      if (msg !== message) {
        PutComponentOperation.write(entity, msg.timestamp, component, buffer)
      } else {
        const bb = createByteBuffer({
          reading: {
            buffer: message.data,
            currentOffset: 0
          }
        })

        component.upsertFromBinary(entity, bb)
        component.clearDirty()
      }
    }

    if (buffer.size()) {
      transport.send(buffer.toBinary())
    }
  }

  /**
   * Iterates the dirty map and generates crdt messages to be send
   * @param dirtyMap a map of { entities: [componentId] }
   */
  function send(dirtyMap: Map<Entity, Set<number>>) {
    const buffer = createByteBuffer()
    for (const [entity, componentsId] of dirtyMap) {
      for (const componentId of componentsId) {
        const component = engine.getComponent(componentId)
        const key = CrdtUtils.getKey(entity, componentId)
        const event = crdtClient.createEvent(
          key,
          component.toBinary(entity).toBinary()
        )
        if (!EntityUtils.isStaticEntity(entity) || crdtEntities.has(entity)) {
          PutComponentOperation.write(
            entity,
            event.timestamp,
            component,
            buffer
          )
        }
      }
      crdtEntities.set(entity, true)
    }

    if (buffer.size()) {
      transport.send(buffer.toBinary())
    }
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
//     if (!crdtEntities.has(entity) || component.isDirty(entity)) {
//       const event = crdtClient.createEvent(
//         getKey(entity, component._id),
//         component.toBinary(entity)
//       )
//       void crdtClient.sendMessage(event)
//       return
//     }
//   }
//   crdtEntities.add(entity)
// }
