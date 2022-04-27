import { Message, crdtProtocol } from '@dcl/crdt'

import type { baseEngine } from '../../engine'
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
export function crdtSceneSystem(engine: baseEngine) {
  const crdtClient = crdtProtocol<Uint8Array>()
  const messages: Message<Uint8Array>[] = []
  const crdtEntities = new Map<Entity, boolean>()

  const transport = createTransport()
  transport.onmessage = parseChunkMessage

  function parseChunkMessage(chunkMessage: MessageEvent<Uint8Array>) {
    if (!chunkMessage.data?.length) return
    const buffer = createByteBuffer({
      reading: { buffer: chunkMessage.data, currentOffset: 0 }
    })

    while (WireMessage.validate(buffer)) {
      const message = PutComponentOperation.read(buffer)
      if (!message) return

      const { entityId, componentClassId, data, timestamp } = message
      messages.push({
        key: CrdtUtils.getKey(entityId, componentClassId),
        data,
        timestamp
      })
    }
  }

  function getMessages() {
    const messagesToProcess = Array.from(messages)
    messages.length = 0
    return messagesToProcess
  }

  /**
   * This messages will be processed on every tick.
   */
  function processMessages() {
    const buffer = createByteBuffer()
    const messagesToProcess = getMessages()

    for (const message of messagesToProcess) {
      const [entity, classId] = CrdtUtils.parseKey(message.key)
      const msg = crdtClient.processMessage(message)
      const component = engine.getComponent(classId)

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

  function send(dirtyMap: Map<Entity, Set<number>>) {
    const buffer = createByteBuffer()
    for (const [entity, componentsId] of dirtyMap) {
      if (EntityUtils.isStaticEntity(entity) && !crdtEntities.has(entity)) {
        crdtEntities.set(entity, true)
        continue
      }
      crdtEntities.set(entity, true)
      for (const componentId of componentsId) {
        const component = engine.getComponent(componentId)
        const key = CrdtUtils.getKey(entity, componentId)
        const event = crdtClient.createEvent(
          key,
          component.toBinary(entity).toBinary()
        )
        PutComponentOperation.write(entity, event.timestamp, component, buffer)
      }
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
