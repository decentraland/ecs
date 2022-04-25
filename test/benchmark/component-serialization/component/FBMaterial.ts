import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../package/EcsType'
import { ByteBuffer } from '../package/ByteBuffer'
import {
  FBMaterialT as fbFBMaterialT,
  FBMaterial as fbFBMaterial
} from '../fb-generated/f-b-material'
import { FBColor } from '../fb-generated/f-b-color'
import { FBColor3T } from '../fb-generated/f-b-color3'
import { FBColor4T } from '../fb-generated/f-b-color4'
import { FBTextureT } from '../fb-generated/f-b-texture'
import { FBTransparencyMode } from '../fb-generated/f-b-transparency-mode'

type Texture = {
  src: string
  samplingMode: number
  wrap: number
  hasAlpha: boolean
}

type Color3 = {
  r: number
  g: number
  b: number
}

type Color4 = {
  r: number
  g: number
  b: number
  a: number
}

export type Material = {
  alphaTest?: number
  albedoColor?: Color4 | Color3
  emissiveColor?: Color3
  metallic?: number
  roughness?: number
  reflectivityColor?: Color3
  directIntensity?: number
  microSurface?: number
  emissiveIntensity?: number
  specularIntensity?: number
  albedoTexture?: Texture
  alphaTexture?: Texture
  emissiveTexture?: Texture
  bumpTexture?: Texture
  castShadows?: boolean
  transparencyMode?: FBTransparencyMode
}

export const FBMaterial: EcsType<Material> = {
  serialize(value: Material, builder: ByteBuffer): void {
    const fbBuilder = new Builder()

    const albedoColorType = FBColor.NONE
    let albedoColor = null
    if (value.albedoColor) {
      if (value.albedoColor as Color3) {
        albedoColor = new FBColor3T(
          value.albedoColor?.r,
          value.albedoColor?.g,
          value.albedoColor?.b
        )
      } else if (value.albedoColor as Color4) {
        albedoColor = new FBColor4T(
          value.albedoColor?.r,
          value.albedoColor?.g,
          value.albedoColor?.b,
          (value.albedoColor as Color4)?.a
        )
      }
    }

    const fbValue = new fbFBMaterialT(
      value.alphaTest,
      albedoColorType,
      albedoColor,
      new FBColor3T(
        value.emissiveColor?.r,
        value.emissiveColor?.g,
        value.emissiveColor?.b
      ),
      value.metallic,
      value.roughness,
      new FBColor3T(
        value.reflectivityColor?.r,
        value.reflectivityColor?.g,
        value.reflectivityColor?.b
      ),
      value.directIntensity,
      value.microSurface,
      value.emissiveIntensity,
      value.specularIntensity,
      new FBTextureT(
        value.albedoTexture?.src,
        value.albedoTexture?.samplingMode,
        value.albedoTexture?.wrap,
        value.albedoTexture?.hasAlpha
      ),
      new FBTextureT(
        value.alphaTexture?.src,
        value.alphaTexture?.samplingMode,
        value.alphaTexture?.wrap,
        value.alphaTexture?.hasAlpha
      ),
      new FBTextureT(
        value.emissiveTexture?.src,
        value.emissiveTexture?.samplingMode,
        value.emissiveTexture?.wrap,
        value.emissiveTexture?.hasAlpha
      ),
      new FBTextureT(
        value.bumpTexture?.src,
        value.bumpTexture?.samplingMode,
        value.bumpTexture?.wrap,
        value.bumpTexture?.hasAlpha
      ),
      value.castShadows,
      value.transparencyMode
    )

    fbBuilder.finish(fbValue.pack(fbBuilder))
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): Material {
    const buf = new FlatBufferByteBuffer(
      reader.buffer().subarray(reader.incrementReadOffset(0))
    )
    const value = fbFBMaterial.getRootAsFBMaterial(buf).unpack()
    return { ...(value as any) }
  }
}
