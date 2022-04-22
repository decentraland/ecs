/* eslint-disable */
import Long from "long"
import * as _m0 from "protobufjs/minimal"

export const protobufPackage = "decentraland.PBMaterial"

export enum PBTransparencyMode {
  OPAQUE = 0,
  ALPHA_TEST = 1,
  ALPHA_BLEND = 2,
  ALPHA_TEST_AND_BLEND = 3,
  AUTO = 4,
  UNRECOGNIZED = -1,
}

export function pBTransparencyModeFromJSON(object: any): PBTransparencyMode {
  switch (object) {
    case 0:
    case "OPAQUE":
      return PBTransparencyMode.OPAQUE
    case 1:
    case "ALPHA_TEST":
      return PBTransparencyMode.ALPHA_TEST
    case 2:
    case "ALPHA_BLEND":
      return PBTransparencyMode.ALPHA_BLEND
    case 3:
    case "ALPHA_TEST_AND_BLEND":
      return PBTransparencyMode.ALPHA_TEST_AND_BLEND
    case 4:
    case "AUTO":
      return PBTransparencyMode.AUTO
    case -1:
    case "UNRECOGNIZED":
    default:
      return PBTransparencyMode.UNRECOGNIZED
  }
}

export function pBTransparencyModeToJSON(object: PBTransparencyMode): string {
  switch (object) {
    case PBTransparencyMode.OPAQUE:
      return "OPAQUE"
    case PBTransparencyMode.ALPHA_TEST:
      return "ALPHA_TEST"
    case PBTransparencyMode.ALPHA_BLEND:
      return "ALPHA_BLEND"
    case PBTransparencyMode.ALPHA_TEST_AND_BLEND:
      return "ALPHA_TEST_AND_BLEND"
    case PBTransparencyMode.AUTO:
      return "AUTO"
    default:
      return "UNKNOWN"
  }
}

export interface PBColor3 {
  r: number
  g: number
  b: number
}

export interface PBColor4 {
  r: number
  g: number
  b: number
  a: number
}

export interface PBColor {
  color3: PBColor3 | undefined
  color4: PBColor4 | undefined
}

export interface PBTexture {
  src: string
  samplingMode: number
  wrap: number
  hasAlpha: boolean
}

/** all params are optionals for default (in a table) */
export interface PBMaterial {
  alphaTest?: number | undefined
  albedoColor?: PBColor | undefined
  emissiveColor?: PBColor3 | undefined
  metallic?: number | undefined
  roughness?: number | undefined
  reflectivityColor?: PBColor3 | undefined
  directIntensity?: number | undefined
  microSurface?: number | undefined
  emissiveIntensity?: number | undefined
  specularIntensity?: number | undefined
  albedoTexture?: PBTexture | undefined
  alphaTexture?: PBTexture | undefined
  emissiveTexture?: PBTexture | undefined
  bumpTexture?: PBTexture | undefined
  castShadows?: boolean | undefined
  transparencyMode?: PBTransparencyMode | undefined
}

function createBasePBColor3(): PBColor3 {
  return { r: 0, g: 0, b: 0 }
}

export const PBColor3 = {
  encode(message: PBColor3, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.r !== 0) {
      writer.uint32(13).float(message.r)
    }
    if (message.g !== 0) {
      writer.uint32(21).float(message.g)
    }
    if (message.b !== 0) {
      writer.uint32(29).float(message.b)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBColor3 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBColor3()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.r = reader.float()
          break
        case 2:
          message.g = reader.float()
          break
        case 3:
          message.b = reader.float()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBColor3 {
    return {
      r: isSet(object.r) ? Number(object.r) : 0,
      g: isSet(object.g) ? Number(object.g) : 0,
      b: isSet(object.b) ? Number(object.b) : 0,
    }
  },

  toJSON(message: PBColor3): unknown {
    const obj: any = {}
    message.r !== undefined && (obj.r = message.r)
    message.g !== undefined && (obj.g = message.g)
    message.b !== undefined && (obj.b = message.b)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBColor3>, I>>(object: I): PBColor3 {
    const message = createBasePBColor3()
    message.r = object.r ?? 0
    message.g = object.g ?? 0
    message.b = object.b ?? 0
    return message
  },
}

function createBasePBColor4(): PBColor4 {
  return { r: 0, g: 0, b: 0, a: 0 }
}

export const PBColor4 = {
  encode(message: PBColor4, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.r !== 0) {
      writer.uint32(13).float(message.r)
    }
    if (message.g !== 0) {
      writer.uint32(21).float(message.g)
    }
    if (message.b !== 0) {
      writer.uint32(29).float(message.b)
    }
    if (message.a !== 0) {
      writer.uint32(37).float(message.a)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBColor4 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBColor4()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.r = reader.float()
          break
        case 2:
          message.g = reader.float()
          break
        case 3:
          message.b = reader.float()
          break
        case 4:
          message.a = reader.float()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBColor4 {
    return {
      r: isSet(object.r) ? Number(object.r) : 0,
      g: isSet(object.g) ? Number(object.g) : 0,
      b: isSet(object.b) ? Number(object.b) : 0,
      a: isSet(object.a) ? Number(object.a) : 0,
    }
  },

  toJSON(message: PBColor4): unknown {
    const obj: any = {}
    message.r !== undefined && (obj.r = message.r)
    message.g !== undefined && (obj.g = message.g)
    message.b !== undefined && (obj.b = message.b)
    message.a !== undefined && (obj.a = message.a)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBColor4>, I>>(object: I): PBColor4 {
    const message = createBasePBColor4()
    message.r = object.r ?? 0
    message.g = object.g ?? 0
    message.b = object.b ?? 0
    message.a = object.a ?? 0
    return message
  },
}

function createBasePBColor(): PBColor {
  return { color3: undefined, color4: undefined }
}

export const PBColor = {
  encode(message: PBColor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.color3 !== undefined) {
      PBColor3.encode(message.color3, writer.uint32(10).fork()).ldelim()
    }
    if (message.color4 !== undefined) {
      PBColor4.encode(message.color4, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBColor {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBColor()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.color3 = PBColor3.decode(reader, reader.uint32())
          break
        case 2:
          message.color4 = PBColor4.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBColor {
    return {
      color3: isSet(object.color3) ? PBColor3.fromJSON(object.color3) : undefined,
      color4: isSet(object.color4) ? PBColor4.fromJSON(object.color4) : undefined,
    }
  },

  toJSON(message: PBColor): unknown {
    const obj: any = {}
    message.color3 !== undefined && (obj.color3 = message.color3 ? PBColor3.toJSON(message.color3) : undefined)
    message.color4 !== undefined && (obj.color4 = message.color4 ? PBColor4.toJSON(message.color4) : undefined)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBColor>, I>>(object: I): PBColor {
    const message = createBasePBColor()
    message.color3 =
      object.color3 !== undefined && object.color3 !== null ? PBColor3.fromPartial(object.color3) : undefined
    message.color4 =
      object.color4 !== undefined && object.color4 !== null ? PBColor4.fromPartial(object.color4) : undefined
    return message
  },
}

function createBasePBTexture(): PBTexture {
  return { src: "", samplingMode: 0, wrap: 0, hasAlpha: false }
}

export const PBTexture = {
  encode(message: PBTexture, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.src !== "") {
      writer.uint32(10).string(message.src)
    }
    if (message.samplingMode !== 0) {
      writer.uint32(16).int32(message.samplingMode)
    }
    if (message.wrap !== 0) {
      writer.uint32(24).int32(message.wrap)
    }
    if (message.hasAlpha === true) {
      writer.uint32(32).bool(message.hasAlpha)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBTexture {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBTexture()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.src = reader.string()
          break
        case 2:
          message.samplingMode = reader.int32()
          break
        case 3:
          message.wrap = reader.int32()
          break
        case 4:
          message.hasAlpha = reader.bool()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBTexture {
    return {
      src: isSet(object.src) ? String(object.src) : "",
      samplingMode: isSet(object.samplingMode) ? Number(object.samplingMode) : 0,
      wrap: isSet(object.wrap) ? Number(object.wrap) : 0,
      hasAlpha: isSet(object.hasAlpha) ? Boolean(object.hasAlpha) : false,
    }
  },

  toJSON(message: PBTexture): unknown {
    const obj: any = {}
    message.src !== undefined && (obj.src = message.src)
    message.samplingMode !== undefined && (obj.samplingMode = Math.round(message.samplingMode))
    message.wrap !== undefined && (obj.wrap = Math.round(message.wrap))
    message.hasAlpha !== undefined && (obj.hasAlpha = message.hasAlpha)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBTexture>, I>>(object: I): PBTexture {
    const message = createBasePBTexture()
    message.src = object.src ?? ""
    message.samplingMode = object.samplingMode ?? 0
    message.wrap = object.wrap ?? 0
    message.hasAlpha = object.hasAlpha ?? false
    return message
  },
}

function createBasePBMaterial(): PBMaterial {
  return {
    alphaTest: undefined,
    albedoColor: undefined,
    emissiveColor: undefined,
    metallic: undefined,
    roughness: undefined,
    reflectivityColor: undefined,
    directIntensity: undefined,
    microSurface: undefined,
    emissiveIntensity: undefined,
    specularIntensity: undefined,
    albedoTexture: undefined,
    alphaTexture: undefined,
    emissiveTexture: undefined,
    bumpTexture: undefined,
    castShadows: undefined,
    transparencyMode: undefined,
  }
}

export const PBMaterial = {
  encode(message: PBMaterial, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.alphaTest !== undefined) {
      writer.uint32(13).float(message.alphaTest)
    }
    if (message.albedoColor !== undefined) {
      PBColor.encode(message.albedoColor, writer.uint32(18).fork()).ldelim()
    }
    if (message.emissiveColor !== undefined) {
      PBColor3.encode(message.emissiveColor, writer.uint32(26).fork()).ldelim()
    }
    if (message.metallic !== undefined) {
      writer.uint32(37).float(message.metallic)
    }
    if (message.roughness !== undefined) {
      writer.uint32(45).float(message.roughness)
    }
    if (message.reflectivityColor !== undefined) {
      PBColor3.encode(message.reflectivityColor, writer.uint32(50).fork()).ldelim()
    }
    if (message.directIntensity !== undefined) {
      writer.uint32(61).float(message.directIntensity)
    }
    if (message.microSurface !== undefined) {
      writer.uint32(69).float(message.microSurface)
    }
    if (message.emissiveIntensity !== undefined) {
      writer.uint32(77).float(message.emissiveIntensity)
    }
    if (message.specularIntensity !== undefined) {
      writer.uint32(85).float(message.specularIntensity)
    }
    if (message.albedoTexture !== undefined) {
      PBTexture.encode(message.albedoTexture, writer.uint32(90).fork()).ldelim()
    }
    if (message.alphaTexture !== undefined) {
      PBTexture.encode(message.alphaTexture, writer.uint32(98).fork()).ldelim()
    }
    if (message.emissiveTexture !== undefined) {
      PBTexture.encode(message.emissiveTexture, writer.uint32(106).fork()).ldelim()
    }
    if (message.bumpTexture !== undefined) {
      PBTexture.encode(message.bumpTexture, writer.uint32(114).fork()).ldelim()
    }
    if (message.castShadows !== undefined) {
      writer.uint32(120).bool(message.castShadows)
    }
    if (message.transparencyMode !== undefined) {
      writer.uint32(128).int32(message.transparencyMode)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBMaterial {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBasePBMaterial()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.alphaTest = reader.float()
          break
        case 2:
          message.albedoColor = PBColor.decode(reader, reader.uint32())
          break
        case 3:
          message.emissiveColor = PBColor3.decode(reader, reader.uint32())
          break
        case 4:
          message.metallic = reader.float()
          break
        case 5:
          message.roughness = reader.float()
          break
        case 6:
          message.reflectivityColor = PBColor3.decode(reader, reader.uint32())
          break
        case 7:
          message.directIntensity = reader.float()
          break
        case 8:
          message.microSurface = reader.float()
          break
        case 9:
          message.emissiveIntensity = reader.float()
          break
        case 10:
          message.specularIntensity = reader.float()
          break
        case 11:
          message.albedoTexture = PBTexture.decode(reader, reader.uint32())
          break
        case 12:
          message.alphaTexture = PBTexture.decode(reader, reader.uint32())
          break
        case 13:
          message.emissiveTexture = PBTexture.decode(reader, reader.uint32())
          break
        case 14:
          message.bumpTexture = PBTexture.decode(reader, reader.uint32())
          break
        case 15:
          message.castShadows = reader.bool()
          break
        case 16:
          message.transparencyMode = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PBMaterial {
    return {
      alphaTest: isSet(object.alphaTest) ? Number(object.alphaTest) : undefined,
      albedoColor: isSet(object.albedoColor) ? PBColor.fromJSON(object.albedoColor) : undefined,
      emissiveColor: isSet(object.emissiveColor) ? PBColor3.fromJSON(object.emissiveColor) : undefined,
      metallic: isSet(object.metallic) ? Number(object.metallic) : undefined,
      roughness: isSet(object.roughness) ? Number(object.roughness) : undefined,
      reflectivityColor: isSet(object.reflectivityColor) ? PBColor3.fromJSON(object.reflectivityColor) : undefined,
      directIntensity: isSet(object.directIntensity) ? Number(object.directIntensity) : undefined,
      microSurface: isSet(object.microSurface) ? Number(object.microSurface) : undefined,
      emissiveIntensity: isSet(object.emissiveIntensity) ? Number(object.emissiveIntensity) : undefined,
      specularIntensity: isSet(object.specularIntensity) ? Number(object.specularIntensity) : undefined,
      albedoTexture: isSet(object.albedoTexture) ? PBTexture.fromJSON(object.albedoTexture) : undefined,
      alphaTexture: isSet(object.alphaTexture) ? PBTexture.fromJSON(object.alphaTexture) : undefined,
      emissiveTexture: isSet(object.emissiveTexture) ? PBTexture.fromJSON(object.emissiveTexture) : undefined,
      bumpTexture: isSet(object.bumpTexture) ? PBTexture.fromJSON(object.bumpTexture) : undefined,
      castShadows: isSet(object.castShadows) ? Boolean(object.castShadows) : undefined,
      transparencyMode: isSet(object.transparencyMode)
        ? pBTransparencyModeFromJSON(object.transparencyMode)
        : undefined,
    }
  },

  toJSON(message: PBMaterial): unknown {
    const obj: any = {}
    message.alphaTest !== undefined && (obj.alphaTest = message.alphaTest)
    message.albedoColor !== undefined &&
      (obj.albedoColor = message.albedoColor ? PBColor.toJSON(message.albedoColor) : undefined)
    message.emissiveColor !== undefined &&
      (obj.emissiveColor = message.emissiveColor ? PBColor3.toJSON(message.emissiveColor) : undefined)
    message.metallic !== undefined && (obj.metallic = message.metallic)
    message.roughness !== undefined && (obj.roughness = message.roughness)
    message.reflectivityColor !== undefined &&
      (obj.reflectivityColor = message.reflectivityColor ? PBColor3.toJSON(message.reflectivityColor) : undefined)
    message.directIntensity !== undefined && (obj.directIntensity = message.directIntensity)
    message.microSurface !== undefined && (obj.microSurface = message.microSurface)
    message.emissiveIntensity !== undefined && (obj.emissiveIntensity = message.emissiveIntensity)
    message.specularIntensity !== undefined && (obj.specularIntensity = message.specularIntensity)
    message.albedoTexture !== undefined &&
      (obj.albedoTexture = message.albedoTexture ? PBTexture.toJSON(message.albedoTexture) : undefined)
    message.alphaTexture !== undefined &&
      (obj.alphaTexture = message.alphaTexture ? PBTexture.toJSON(message.alphaTexture) : undefined)
    message.emissiveTexture !== undefined &&
      (obj.emissiveTexture = message.emissiveTexture ? PBTexture.toJSON(message.emissiveTexture) : undefined)
    message.bumpTexture !== undefined &&
      (obj.bumpTexture = message.bumpTexture ? PBTexture.toJSON(message.bumpTexture) : undefined)
    message.castShadows !== undefined && (obj.castShadows = message.castShadows)
    message.transparencyMode !== undefined &&
      (obj.transparencyMode =
        message.transparencyMode !== undefined ? pBTransparencyModeToJSON(message.transparencyMode) : undefined)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<PBMaterial>, I>>(object: I): PBMaterial {
    const message = createBasePBMaterial()
    message.alphaTest = object.alphaTest ?? undefined
    message.albedoColor =
      object.albedoColor !== undefined && object.albedoColor !== null
        ? PBColor.fromPartial(object.albedoColor)
        : undefined
    message.emissiveColor =
      object.emissiveColor !== undefined && object.emissiveColor !== null
        ? PBColor3.fromPartial(object.emissiveColor)
        : undefined
    message.metallic = object.metallic ?? undefined
    message.roughness = object.roughness ?? undefined
    message.reflectivityColor =
      object.reflectivityColor !== undefined && object.reflectivityColor !== null
        ? PBColor3.fromPartial(object.reflectivityColor)
        : undefined
    message.directIntensity = object.directIntensity ?? undefined
    message.microSurface = object.microSurface ?? undefined
    message.emissiveIntensity = object.emissiveIntensity ?? undefined
    message.specularIntensity = object.specularIntensity ?? undefined
    message.albedoTexture =
      object.albedoTexture !== undefined && object.albedoTexture !== null
        ? PBTexture.fromPartial(object.albedoTexture)
        : undefined
    message.alphaTexture =
      object.alphaTexture !== undefined && object.alphaTexture !== null
        ? PBTexture.fromPartial(object.alphaTexture)
        : undefined
    message.emissiveTexture =
      object.emissiveTexture !== undefined && object.emissiveTexture !== null
        ? PBTexture.fromPartial(object.emissiveTexture)
        : undefined
    message.bumpTexture =
      object.bumpTexture !== undefined && object.bumpTexture !== null
        ? PBTexture.fromPartial(object.bumpTexture)
        : undefined
    message.castShadows = object.castShadows ?? undefined
    message.transparencyMode = object.transparencyMode ?? undefined
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
