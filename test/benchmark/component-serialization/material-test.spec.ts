import { measureTime } from '../utils'
import { FBMaterial, Material as FBMaterialType } from './component/FBMaterial'
import { Material, StrictMaterial } from './component/Material'
import { PBMaterial } from './component/PBMaterial'
import { TransparencyMode } from './components-legacy-ecs'
import { FBTransparencyMode } from './fb-generated/f-b-transparency-mode'
import { createByteBuffer } from './package/ByteBuffer'
import { PBTransparencyMode } from './pb-generated/PBMaterial'

const filledMaterialComponent = {
  alphaTest: Math.PI,
  emissiveColor: { r: 0.4, g: 0.7, b: 0.1 },
  metallic: 1.30435436,
  roughness: 0.4,
  reflectivityColor: { r: 0.4, g: 0.7, b: 0.1 },
  directIntensity: 1.0,
  microSurface: Math.E,
  emissiveIntensity: Math.SQRT1_2,
  specularIntensity: Math.SQRT2,
  albedoTexture: {
    src: 'images/test-image.png',
    samplingMode: 1278278,
    wrap: 3840753475,
    hasAlpha: true
  },
  alphaTexture: {
    src: 'images/test-image-B.png',
    samplingMode: 18,
    wrap: 4843958739,
    hasAlpha: true
  },
  emissiveTexture: {
    src: 'images/test-image-C.png',
    samplingMode: 18,
    wrap: 1843958739,
    hasAlpha: true
  },
  bumpTexture: {
    src: 'images/test-image-D.png',
    samplingMode: 18,
    wrap: 46958739,
    hasAlpha: true
  },
  castShadows: true
}

const MaterialTestCount = 12000
const MaterialBufferInitialCapacity = MaterialTestCount * 1500

describe('Benchmark component Material ', () => {
  it('empty value', () => {
    // Material
    const valueMaterial: ReturnType<typeof Material['deserialize']> = {}
    const bufferMaterial = createByteBuffer({
      initialCapacity: MaterialBufferInitialCapacity
    })
    const dtMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        Material.serialize(valueMaterial, bufferMaterial)
      }
    })

    // FlatBuffer Material
    const valueFBMaterial: FBMaterialType = {}
    const bufferFBMaterial = createByteBuffer({
      initialCapacity: MaterialBufferInitialCapacity
    })
    const dtFBMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        FBMaterial.serialize(valueFBMaterial, bufferFBMaterial)
      }
    })

    // ProtoBuffer Material
    const valuePBMaterial: ReturnType<typeof PBMaterial['deserialize']> = {}
    const bufferPBMaterial = createByteBuffer({
      initialCapacity: MaterialBufferInitialCapacity
    })
    const dtPBMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        PBMaterial.serialize(valuePBMaterial, bufferPBMaterial)
      }
    })

    console.log(
      ` Serialization ${MaterialTestCount} Materials component (with empty information) using only Bytebufffer:
          Time:
          - Raw ${dtMaterial}ms
          - Flatbuffer ${dtFBMaterial}ms
          - Protobuffer ${dtPBMaterial}ms
          Size:
          - Raw ${bufferMaterial.incrementWriteOffset(0).toLocaleString()} bytes
          - Flatbuffer ${bufferFBMaterial
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
          - Protobuffer ${bufferPBMaterial
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
      `
    )
  })

  it('filled value (with OptionalMaterial)', () => {
    // Material
    const valueMaterial: ReturnType<typeof Material['deserialize']> = {
      ...filledMaterialComponent,
      albedoColor: { r: 0.8695, g: 0.8329, b: 0.12447, a: 0.34394 },
      transparencyMode: TransparencyMode.ALPHA_TEST_AND_BLEND
    }
    const bufferMaterial = createByteBuffer({
      initialCapacity: MaterialBufferInitialCapacity
    })
    const dtMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        Material.serialize(valueMaterial, bufferMaterial)
      }
    })

    // FlatBuffer Transform
    const valueFBMaterial: FBMaterialType = {
      ...filledMaterialComponent,
      albedoColor: { r: 0.8695, g: 0.8329, b: 0.12447, a: 0.34394 },
      transparencyMode: FBTransparencyMode.ALPHA_BLEND
    }
    const bufferFBMaterial = createByteBuffer({
      initialCapacity: MaterialBufferInitialCapacity
    })
    const dtFBMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        FBMaterial.serialize(valueFBMaterial, bufferFBMaterial)
      }
    })

    // ProtoBuffer Material
    const valuePBMaterial: ReturnType<typeof PBMaterial['deserialize']> = {
      ...filledMaterialComponent,
      albedoColor: {
        color3: undefined,
        color4: { r: 0.8695, g: 0.8329, b: 0.12447, a: 0.34394 }
      },
      transparencyMode: PBTransparencyMode.ALPHA_BLEND
    }
    const bufferPBMaterial = createByteBuffer({
      initialCapacity: MaterialBufferInitialCapacity
    })
    const dtPBMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        PBMaterial.serialize(valuePBMaterial, bufferPBMaterial)
      }
    })

    const bufferStrictMaterial = createByteBuffer({
      initialCapacity: MaterialBufferInitialCapacity
    })
    const valueStrictMaterial: ReturnType<
      typeof StrictMaterial['deserialize']
    > = {
      ...filledMaterialComponent,
      albedoColor: { r: 0.8695, g: 0.8329, b: 0.12447, a: 0.34394 },
      transparencyMode: TransparencyMode.ALPHA_TEST_AND_BLEND
    }
    const dtStrictMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        StrictMaterial.serialize(valueStrictMaterial, bufferStrictMaterial)
      }
    })

    console.log(
      ` Serialization ${MaterialTestCount} Materials component (with filled information) using only Bytebufffer:
          Time:
          - EcsType with optional ${dtMaterial}ms
          - EcsType without optional ${dtStrictMaterial}ms
          - Flatbuffer ${dtFBMaterial}ms
          - Protobuffer ${dtPBMaterial}ms
          Size:
          - EcsType with optional ${bufferMaterial
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
          - EcsType without optional ${bufferStrictMaterial
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
          - Flatbuffer ${bufferFBMaterial
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
          - Protobuffer ${bufferPBMaterial
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
      `
    )

    const ecsTypeMaterialBuffer = createByteBuffer({
      reading: { buffer: bufferMaterial.toBinary(), currentOffset: 0 }
    })
    const dtDeserializeMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        Material.deserialize(ecsTypeMaterialBuffer)
      }
    })

    const ecsTypeStrictMaterialBuffer = createByteBuffer({
      reading: { buffer: bufferStrictMaterial.toBinary(), currentOffset: 0 }
    })
    const dtDeserializeStrictMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        StrictMaterial.deserialize(ecsTypeStrictMaterialBuffer)
      }
    })

    const ecsTypeFBMaterialBuffer = createByteBuffer({
      reading: { buffer: bufferFBMaterial.toBinary(), currentOffset: 0 }
    })
    const dtDeserializeFBMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        FBMaterial.deserialize(ecsTypeFBMaterialBuffer)
      }
    })

    const ecsTypePBMaterialBuffer = createByteBuffer({
      reading: { buffer: bufferPBMaterial.toBinary(), currentOffset: 0 }
    })
    const dtDeserializePBMaterial = measureTime(() => {
      for (let i = 0; i < MaterialTestCount; i++) {
        PBMaterial.deserialize(ecsTypePBMaterialBuffer)
      }
    })

    console.log(
      ` Deserialization ${MaterialTestCount} Materials component (with filled information) using only Bytebufffer:
          Time:
          - EcsType with optional ${dtDeserializeMaterial}ms
          - EcsType without optional ${dtDeserializeStrictMaterial}ms
          - Flatbuffer ${dtDeserializeFBMaterial}ms
          - Protobuffer ${dtDeserializePBMaterial}ms
      `
    )
  })
})
