/* eslint-disable */
import Long from "long"
import * as _m0 from "protobufjs/minimal"

export const protobufPackage = "decentraland.PBTransform"

export interface PBQuaternion {
  x: number
  y: number
  z: number
  w: number
}

export interface PBVector3 {
  x: number
  y: number
  z: number
}

/** all params are optionals for default (in a table) */
export interface PBTransform {
  position: PBVector3 | undefined
  rotation: PBQuaternion | undefined
  scale: PBVector3 | undefined
}

function createBasePBQuaternion(): PBQuaternion {
  return { x: 0, y: 0, z: 0, w: 0 }
}

export const PBQuaternion = {
  encode(message: PBQuaternion, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x)
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y)
    }
    if (message.z !== 0) {
      writer.uint32(29).float(message.z)
    }
    if (message.w !== 0) {
      writer.uint32(37).float(message.w)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBQuaternion {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBQuaternion()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.x = reader.float()
          break
        case 2:
          message.y = reader.float()
          break
        case 3:
          message.z = reader.float()
          break
        case 4:
          message.w = reader.float()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBQuaternion {
    return {
      x: isSet(object.x) ? Number(object.x) : 0,
      y: isSet(object.y) ? Number(object.y) : 0,
      z: isSet(object.z) ? Number(object.z) : 0,
      w: isSet(object.w) ? Number(object.w) : 0,
    }
  },

  toJSON(message: PBQuaternion): unknown {
    const obj: any = {}
    message.x !== undefined && (obj.x = message.x)
    message.y !== undefined && (obj.y = message.y)
    message.z !== undefined && (obj.z = message.z)
    message.w !== undefined && (obj.w = message.w)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBQuaternion>, I>>(object: I): PBQuaternion {
    const message = createBasePBQuaternion()
    message.x = object.x ?? 0
    message.y = object.y ?? 0
    message.z = object.z ?? 0
    message.w = object.w ?? 0
    return message
  },
}

function createBasePBVector3(): PBVector3 {
  return { x: 0, y: 0, z: 0 }
}

export const PBVector3 = {
  encode(message: PBVector3, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x)
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y)
    }
    if (message.z !== 0) {
      writer.uint32(29).float(message.z)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBVector3 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBVector3()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.x = reader.float()
          break
        case 2:
          message.y = reader.float()
          break
        case 3:
          message.z = reader.float()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBVector3 {
    return {
      x: isSet(object.x) ? Number(object.x) : 0,
      y: isSet(object.y) ? Number(object.y) : 0,
      z: isSet(object.z) ? Number(object.z) : 0,
    }
  },

  toJSON(message: PBVector3): unknown {
    const obj: any = {}
    message.x !== undefined && (obj.x = message.x)
    message.y !== undefined && (obj.y = message.y)
    message.z !== undefined && (obj.z = message.z)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBVector3>, I>>(object: I): PBVector3 {
    const message = createBasePBVector3()
    message.x = object.x ?? 0
    message.y = object.y ?? 0
    message.z = object.z ?? 0
    return message
  },
}

function createBasePBTransform(): PBTransform {
  return { position: undefined, rotation: undefined, scale: undefined }
}

export const PBTransform = {
  encode(message: PBTransform, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.position !== undefined) {
      PBVector3.encode(message.position, writer.uint32(10).fork()).ldelim()
    }
    if (message.rotation !== undefined) {
      PBQuaternion.encode(message.rotation, writer.uint32(18).fork()).ldelim()
    }
    if (message.scale !== undefined) {
      PBVector3.encode(message.scale, writer.uint32(26).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBTransform {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBTransform()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.position = PBVector3.decode(reader, reader.uint32())
          break
        case 2:
          message.rotation = PBQuaternion.decode(reader, reader.uint32())
          break
        case 3:
          message.scale = PBVector3.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBTransform {
    return {
      position: isSet(object.position) ? PBVector3.fromJSON(object.position) : undefined,
      rotation: isSet(object.rotation) ? PBQuaternion.fromJSON(object.rotation) : undefined,
      scale: isSet(object.scale) ? PBVector3.fromJSON(object.scale) : undefined,
    }
  },

  toJSON(message: PBTransform): unknown {
    const obj: any = {}
    message.position !== undefined && (obj.position = message.position ? PBVector3.toJSON(message.position) : undefined)
    message.rotation !== undefined &&
      (obj.rotation = message.rotation ? PBQuaternion.toJSON(message.rotation) : undefined)
    message.scale !== undefined && (obj.scale = message.scale ? PBVector3.toJSON(message.scale) : undefined)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBTransform>, I>>(object: I): PBTransform {
    const message = createBasePBTransform()
    message.position =
      object.position !== undefined && object.position !== null ? PBVector3.fromPartial(object.position) : undefined
    message.rotation =
      object.rotation !== undefined && object.rotation !== null ? PBQuaternion.fromPartial(object.rotation) : undefined
    message.scale =
      object.scale !== undefined && object.scale !== null ? PBVector3.fromPartial(object.scale) : undefined
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
