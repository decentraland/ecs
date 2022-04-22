import { measureTime } from '../utils'
import { FBMaterial, Material as FBMaterialType } from './component/FBMaterial'
import { Material, StrictMaterial } from './component/Material'
import { PBMaterial } from './component/PBMaterial'
import { TransparencyMode } from './components-legacy-ecs'
import { FBTransparencyMode } from './fb-generated/f-b-transparency-mode'
import { createByteBuffer } from './package/ByteBuffer'
import { PBTransparencyMode } from './pb-generated/FBMaterial'

describe('Benchmark component Material ', () => {
  it('empty value', () => {
    const N = 7317

    // Material
    const valueMaterial: ReturnType<typeof Material['deserialize']> = {}
    const buffer1 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtMaterial = measureTime(() => {
      for (let i = 0; i < N; i++) {
        Material.serialize(valueMaterial, buffer1)
      }
    })

    // FlatBuffer Material
    const valueFBMaterial: FBMaterialType = {}
    const buffer2 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtFBMaterial = measureTime(() => {
      for (let i = 0; i < N; i++) {
        FBMaterial.serialize(valueFBMaterial, buffer2)
      }
    })

    // ProtoBuffer Material
    const valuePBMaterial: ReturnType<typeof PBMaterial['deserialize']> = {}
    const buffer3 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtPBMaterial = measureTime(() => {
      for (let i = 0; i < N; i++) {
        PBMaterial.serialize(valuePBMaterial, buffer3)
      }
    })

    console.log(
      ` Serialization ${N} Materials component (with empty information) using only Bytebufffer:
          Time:
          - Raw ${dtMaterial}ms
          - Flatbuffer ${dtFBMaterial}ms
          - Protobuffer ${dtPBMaterial}ms
          Size:
          - Raw ${buffer1.incrementWriteOffset(0)} bytes
          - Flatbuffer ${buffer2.incrementWriteOffset(0)} bytes
          - Protobuffer ${buffer3.incrementWriteOffset(0)} bytes
      `
    )
  })

  it('filled value (with OptionalMaterial)', () => {
    const N = 7317

    // Material
    const valueMaterial: ReturnType<typeof Material['deserialize']> = {
      alphaTest: Math.PI,
      albedoColor: { r: 0.4, g: 0.7, b: 0.1, a: 1.0 },
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
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      alphaTexture: {
        src: 'images/test-image-B.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      emissiveTexture: {
        src: 'images/test-image-C.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      bumpTexture: {
        src: 'images/test-image-D.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      castShadows: true,
      transparencyMode: TransparencyMode.ALPHA_TEST_AND_BLEND
    }
    const buffer1 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtMaterial = measureTime(() => {
      for (let i = 0; i < N; i++) {
        Material.serialize(valueMaterial, buffer1)
      }
    })

    // FlatBuffer Transform
    const valueFBMaterial: FBMaterialType = {
      alphaTest: Math.PI,
      albedoColor: { r: 0.4, g: 0.7, b: 0.1, a: 1.0 },
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
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      alphaTexture: {
        src: 'images/test-image-B.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      emissiveTexture: {
        src: 'images/test-image-C.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      bumpTexture: {
        src: 'images/test-image-D.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      castShadows: true,
      transparencyMode: FBTransparencyMode.ALPHA_BLEND
    }
    const buffer2 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtFBMaterial = measureTime(() => {
      for (let i = 0; i < N; i++) {
        FBMaterial.serialize(valueFBMaterial, buffer2)
      }
    })

    // ProtoBuffer Material
    const valuePBMaterial: ReturnType<typeof PBMaterial['deserialize']> = {
      alphaTest: Math.PI,
      albedoColor: {
        color4: { r: 0.4, g: 0.7, b: 0.1, a: 1.0 },
        color3: undefined
      },
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
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      alphaTexture: {
        src: 'images/test-image-B.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      emissiveTexture: {
        src: 'images/test-image-C.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      bumpTexture: {
        src: 'images/test-image-D.png',
        samplingMode: 18,
        wrap: Math.E,
        hasAlpha: true
      },
      castShadows: true,
      transparencyMode: PBTransparencyMode.ALPHA_BLEND
    }
    const buffer3 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtPBMaterial = measureTime(() => {
      for (let i = 0; i < N; i++) {
        PBMaterial.serialize(valuePBMaterial, buffer3)
      }
    })


    const buffer4 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtStrictMaterial = measureTime(() => {
      for (let i = 0; i < N; i++) {
        StrictMaterial.serialize(valueMaterial, buffer4)
      }
    })

    console.log(
      ` Serialization ${N} Materials component (with filled information) using only Bytebufffer:
          Time:
          - EcsType with optional ${dtMaterial}ms
          - EcsType without optional ${dtStrictMaterial}
          - Flatbuffer ${dtFBMaterial}ms
          - Protobuffer ${dtPBMaterial}ms
          Size:
          - EcsType with optional ${buffer1.incrementWriteOffset(0)} bytes
          - EcsType without optional ${buffer4.incrementWriteOffset(0)} bytes
          - Flatbuffer ${buffer2.incrementWriteOffset(0)} bytes
          - Protobuffer ${buffer3.incrementWriteOffset(0)} bytes
      `
    )
  })
})
