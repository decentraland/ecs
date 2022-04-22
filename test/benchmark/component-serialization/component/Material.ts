import { MapType } from '../package/MapType'
import { Optional } from '../package/Optional'
import { Float32 } from '../package/basic/Float'
import { Int32, Boolean, Enum } from '../package/basic/Integer'
import { String } from '../package/basic/String'

enum TransparencyMode {
  OPAQUE = 0,
  ALPHA_TEST = 1,
  ALPHA_BLEND = 2,
  ALPHA_TEST_AND_BLEND = 3,
  AUTO = 4
}

const Texture = MapType({
  src: String,
  samplingMode: Int32,
  wrap: Float32,
  hasAlpha: Boolean
})

const Color3 = MapType({
  r: Float32,
  g: Float32,
  b: Float32
})

const Color4 = MapType({
  r: Float32,
  g: Float32,
  b: Float32,
  a: Float32
})

export const Material = MapType({
  alphaTest: Optional(Float32),
  albedoColor: Optional(Color4),
  emissiveColor: Optional(Color3),
  metallic: Optional(Float32),
  roughness: Optional(Float32),
  reflectivityColor: Optional(Color3),
  directIntensity: Optional(Float32),
  microSurface: Optional(Float32),
  emissiveIntensity: Optional(Float32),
  specularIntensity: Optional(Float32),
  albedoTexture: Optional(Texture),
  alphaTexture: Optional(Texture),
  emissiveTexture: Optional(Texture),
  bumpTexture: Optional(Texture),
  castShadows: Optional(Boolean),
  transparencyMode: Optional(Enum<TransparencyMode>(String))
})

export const StrictMaterial = MapType({
  alphaTest: Float32,
  albedoColor: Color4,
  emissiveColor: Color3,
  metallic: Float32,
  roughness: Float32,
  reflectivityColor: Color3,
  directIntensity: Float32,
  microSurface: Float32,
  emissiveIntensity: Float32,
  specularIntensity: Float32,
  albedoTexture: Texture,
  alphaTexture: Texture,
  emissiveTexture: Texture,
  bumpTexture: Texture,
  castShadows: Boolean,
  transparencyMode: Enum<TransparencyMode>(String)
})