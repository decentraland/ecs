/* eslint-disable */
import Long from "long"
import * as _m0 from "protobufjs/minimal"

export const protobufPackage = "decentraland.ecs"

export interface PBBoxShape {
  withCollisions: boolean
  isPointerBlocker: boolean
  visible: boolean
  uvs: number[]
}

function createBasePBBoxShape(): PBBoxShape {
  return { withCollisions: false, isPointerBlocker: false, visible: false, uvs: [] }
}

export const PBBoxShape = {
  encode(message: PBBoxShape, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.withCollisions === true) {
      writer.uint32(8).bool(message.withCollisions)
    }
    if (message.isPointerBlocker === true) {
      writer.uint32(16).bool(message.isPointerBlocker)
    }
    if (message.visible === true) {
      writer.uint32(24).bool(message.visible)
    }
    writer.uint32(34).fork()
    for (const v of message.uvs) {
      writer.float(v)
    }
    writer.ldelim()
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBBoxShape {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBBoxShape()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.withCollisions = reader.bool()
          break
        case 2:
          message.isPointerBlocker = reader.bool()
          break
        case 3:
          message.visible = reader.bool()
          break
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos
            while (reader.pos < end2) {
              message.uvs.push(reader.float())
            }
          } else {
            message.uvs.push(reader.float())
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBBoxShape {
    return {
      withCollisions: isSet(object.withCollisions) ? Boolean(object.withCollisions) : false,
      isPointerBlocker: isSet(object.isPointerBlocker) ? Boolean(object.isPointerBlocker) : false,
      visible: isSet(object.visible) ? Boolean(object.visible) : false,
      uvs: Array.isArray(object?.uvs) ? object.uvs.map((e: any) => Number(e)) : [],
    }
  },

  toJSON(message: PBBoxShape): unknown {
    const obj: any = {}
    message.withCollisions !== undefined && (obj.withCollisions = message.withCollisions)
    message.isPointerBlocker !== undefined && (obj.isPointerBlocker = message.isPointerBlocker)
    message.visible !== undefined && (obj.visible = message.visible)
    if (message.uvs) {
      obj.uvs = message.uvs.map((e) => e)
    } else {
      obj.uvs = []
    }
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBBoxShape>, I>>(object: I): PBBoxShape {
    const message = createBasePBBoxShape()
    message.withCollisions = object.withCollisions ?? false
    message.isPointerBlocker = object.isPointerBlocker ?? false
    message.visible = object.visible ?? false
    message.uvs = object.uvs?.map((e) => e) || []
    return message
  },
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>, never>

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
