import { Message, crdtProtocol } from '@dcl/crdt'

import type { PreEngine } from '../../engine'
import { Entity } from '../../engine/entity'
import EntityUtils from '../../engine/entity-utils'
import { createByteBuffer } from '../../serialization/ByteBuffer'
import { PutComponentOperation } from '../../serialization/crdt/componentOperation'
import WireMessage from '../../serialization/wireMessage'
import { createTransport } from './transport'
import CrdtUtils from './utils'

type TransportMessage = Message<Uint8Array> & { transportId: string }
/**
 * TODO:
 * What about when we remove the SyncComponent ? Should we notify all the clients? How ?
 * Where do we create the transport and process the received messages?
 */
export function crdtSceneSystem(engine: PreEngine) {
  // CRDT Client
  const crdtClient = crdtProtocol<Uint8Array>()
  // Messages that we received at transport.onMessage waiting to be processed
  const pendingTransportMessages: TransportMessage[] = []
  // Messages already processed but that we need to broadcast to other transports.
  const transportMessages: TransportMessage[] = []
  // Map of entities already processed at least once
  const crdtEntities = new Map<Entity, boolean>()

  const transport = createTransport({
    onData: parseChunkMessage,
    id: 'some-id'
  })

  /**
   * Receives a chunk of binary messages and stores all the valid
   * Component Operation Messages at messages queue
   * @param chunkMessage A chunk of binary messages
   */
  function parseChunkMessage(transportId: string) {
    return function parseChunkMessage(chunkMessage: MessageEvent<Uint8Array>) {
      if (!chunkMessage.data?.length) return
      const buffer = createByteBuffer({
        reading: { buffer: chunkMessage.data, currentOffset: 0 }
      })

      while (WireMessage.validate(buffer)) {
        const message = PutComponentOperation.read(buffer)!

        const { entityId, componentId, data, timestamp } = message
        pendingTransportMessages.push({
          key: CrdtUtils.getKey(entityId, componentId),
          data,
          timestamp,
          transportId
        })
      }
    }
  }

  /**
   * Return and clear the messaes queue
   * @returns messages recieved by the transport to process on the next tick
   */
  function getMessages() {
    const messagesToProcess = Array.from(pendingTransportMessages)
    pendingTransportMessages.length = 0
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
        // CRDT outdated message. Resend this message through the wire
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
        transportMessages.push(message)
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
  function createMessages(dirtyMap: Map<Entity, Set<number>>) {
    const buffer = createByteBuffer()

    // Broadcast messages from other transports.
    for (const message of transportMessages) {
      if (transport.id === message.transportId) continue
      const [entityId, componentId] = CrdtUtils.parseKey(message.key)
      const comp = engine.getComponent(componentId)
      PutComponentOperation.write(entityId, message.timestamp, comp, buffer)
    }

    // Process dirty entities, and create crdt messages
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
    createMessages,
    processMessages
  }
}
