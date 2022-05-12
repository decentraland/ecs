import { crdtProtocol, Message } from '@dcl/crdt'

import type { PreEngine } from '../../engine'
import { Entity } from '../../engine/entity'
import EntityUtils from '../../engine/entity-utils'
import { createByteBuffer } from '../../serialization/ByteBuffer'
import { PutComponentOperation } from '../../serialization/crdt/componentOperation'
import WireMessage from '../../serialization/wireMessage'
import { createTransport } from './transport'
import { ReceiveMessage, TransportMessage } from './types'
import CrdtUtils from './utils'

export function crdtSceneSystem(engine: PreEngine) {
  // CRDT Client
  const crdtClient = crdtProtocol<Uint8Array>()
  // Messages that we received at transport.onMessage waiting to be processed
  const receivedMessages: ReceiveMessage[] = []
  // Messages already processed by the engine but that we need to broadcast to other transports.
  const transportMessages: Set<TransportMessage> = new Set()
  // Map of entities already processed at least once
  const crdtEntities = new Map<Entity, boolean>()

  const TRANSPORT_ID = 'some-id'
  const transports = [
    createTransport({
      onData: parseChunkMessage,
      id: TRANSPORT_ID,
      filter: (message: TransportMessage): boolean => {
        // TODO: filter component id for renderer.
        return message.transportId !== TRANSPORT_ID && !!message.componentId
      }
    })
  ]

  /**
   *
   * @param transportId tranport id to identiy messages
   * @returns a function to process received messages
   */
  function parseChunkMessage(transportId: string) {
    /**
     * Receives a chunk of binary messages and stores all the valid
     * Component Operation Messages at messages queue
     * @param chunkMessage A chunk of binary messages
     */
    return function parseChunkMessage(chunkMessage: MessageEvent<Uint8Array>) {
      if (!chunkMessage.data?.length) return
      const buffer = createByteBuffer({
        reading: { buffer: chunkMessage.data, currentOffset: 0 }
      })

      while (WireMessage.validate(buffer)) {
        const message = PutComponentOperation.read(buffer)!

        const { entityId, componentId, data, timestamp } = message
        receivedMessages.push({
          entity: entityId,
          componentId,
          data,
          timestamp,
          transportId,
          messageBuffer: new Uint8Array()
        })
      }
    }
  }

  /**
   * Return and clear the messaes queue
   * @returns messages recieved by the transport to process on the next tick
   */
  function getMessages<T = unknown>(value: T[] | Set<T>) {
    const messagesToProcess = Array.from(value)
    if (Array.isArray(value)) {
      value.length = 0
    } else {
      value.clear()
    }
    return messagesToProcess
  }

  /**
   * This fn will be called on every tick.
   * Process all the messages queue received by the transport
   */
  function receiveMessages() {
    const messagesToProcess = getMessages(receivedMessages)

    for (const transport of transports) {
      const buffer = createByteBuffer()
      for (const message of messagesToProcess) {
        const crdtMessage: Message<Uint8Array> = {
          key: CrdtUtils.getKey(message.entity, message.componentId),
          data: message.data,
          timestamp: message.timestamp
        }
        const component = engine.getComponent(message.componentId)
        const currentMessage = crdtClient.processMessage(crdtMessage)

        // CRDT outdated message. Resend this message through the wire
        // TODO: perf transactor
        if (crdtMessage !== currentMessage) {
          // CRDT outdated message. Resend this message through the wire
          PutComponentOperation.write(
            message.entity,
            currentMessage.timestamp,
            component,
            buffer
          )
        } else {
          const opts = { reading: { buffer: message.data, currentOffset: 0 } }
          const bb = createByteBuffer(opts)

          // Update engine component
          component.upsertFromBinary(message.entity, bb)
          component.clearDirty()

          // Add message to transport queue to be processed by others transports
          transportMessages.add(message)
        }
      }

      if (buffer.size()) {
        transport.send(buffer.toBinary())
      }
    }
  }

  /**
   * Iterates the dirty map and generates crdt messages to be send
   * @param dirtyMap a map of { entities: [componentId] }
   */
  function createMessages(dirtyMap: Map<Entity, Set<number>>) {
    // CRDT Messages will be the merge between the recieved transport messages
    // and the new crdt messages
    const crdtMessages = getMessages(transportMessages)
    const buffer = createByteBuffer()

    for (const [entity, componentsId] of dirtyMap) {
      for (const componentId of componentsId) {
        const component = engine.getComponent(componentId)
        const key = CrdtUtils.getKey(entity, componentId)
        const event = crdtClient.createEvent(
          key,
          component.toBinary(entity).toBinary()
        )
        const offset = buffer.currentWriteOffset()

        // There is no need to create messages for the static entities the first time they are created
        // They are part of the scene loading. Send only updates.
        if (!EntityUtils.isStaticEntity(entity) || crdtEntities.has(entity)) {
          PutComponentOperation.write(
            entity,
            event.timestamp,
            component,
            buffer
          )
          crdtMessages.push({
            componentId,
            entity,
            timestamp: event.timestamp,
            messageBuffer: buffer
              .buffer()
              .subarray(offset, buffer.currentWriteOffset())
          })
        }
      }
      crdtEntities.set(entity, true)
    }
    const transportBuffer = createByteBuffer()
    for (const transport of transports) {
      transportBuffer.resetBuffer()
      for (const message of crdtMessages) {
        if (transport.filter(message)) {
          transportBuffer.writeBuffer(message.messageBuffer, false)
        }
      }
      if (transportBuffer.size()) {
        transport.send(transportBuffer.toBinary())
      }
    }
  }

  return {
    createMessages,
    receiveMessages
  }
}
