import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { Builder } from 'flatbuffers'
import { measureTime } from '../utils'
import { FBTransform } from './component/FBTransform'
import { PBTransform } from './component/PBTransform'
import { Transform } from './component/Transform'
import { FBTransformT } from './fb-generated/f-b-transform'
import { QuaternionT } from './fb-generated/quaternion'
import { Vector3T } from './fb-generated/vector3'
import { createByteBuffer } from './package/ByteBuffer'

type LegacyTransform = ReturnType<typeof Transform['deserialize']>

const TransformTestCount = 12000
const TransformBufferInitialCapacity = TransformTestCount * 200

describe('benchmark ', () => {
  it('real case, only using bytebuffer without realloc', () => {
    const valueTransform: LegacyTransform = {
      position: Vector3.Up(),
      rotation: Quaternion.Identity(),
      scale: Vector3.One()
    }

    // Transform
    const bufferTransform = createByteBuffer({
      initialCapacity: TransformBufferInitialCapacity
    })
    const dtTransform = measureTime(() => {
      for (let i = 0; i < TransformTestCount; i++) {
        Transform.serialize(valueTransform, bufferTransform)
      }
    })

    // FlatBuffer Transform
    const bufferFBTransform = createByteBuffer({
      initialCapacity: TransformBufferInitialCapacity
    })
    const dtFBTransform = measureTime(() => {
      for (let i = 0; i < TransformTestCount; i++) {
        FBTransform.serialize(valueTransform, bufferFBTransform)
      }
    })

    // FlatBuffer Transform
    const bufferPBTransform = createByteBuffer({
      initialCapacity: TransformBufferInitialCapacity
    })
    const dtPBTransform = measureTime(() => {
      for (let i = 0; i < TransformTestCount; i++) {
        PBTransform.serialize(valueTransform, bufferPBTransform)
      }
    })

    console.log(
      ` Serialization ${TransformTestCount} transforms using only Bytebufffer:
          Time:
          - Raw ${dtTransform}ms
          - Flatbuffer ${dtFBTransform}ms
          - protobuffer ${dtPBTransform}ms
          Size:
          - Raw ${bufferTransform
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
          - Flatbuffer ${bufferFBTransform
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
          - Protobuffer ${bufferPBTransform
            .incrementWriteOffset(0)
            .toLocaleString()} bytes
      `
    )

    const ecsTypeTransformBuffer = createByteBuffer({
      reading: { buffer: bufferTransform.toBinary(), currentOffset: 0 }
    })
    const dtDeserializeTransform = measureTime(() => {
      for (let i = 0; i < TransformTestCount; i++) {
        Transform.deserialize(ecsTypeTransformBuffer)
      }
    })

    const ecsTypeFBTransformBuffer = createByteBuffer({
      reading: { buffer: bufferFBTransform.toBinary(), currentOffset: 0 }
    })
    const dtDeserializeFBTransform = measureTime(() => {
      for (let i = 0; i < TransformTestCount; i++) {
        FBTransform.deserialize(ecsTypeFBTransformBuffer)
      }
    })

    const ecsTypePBTransformBuffer = createByteBuffer({
      reading: { buffer: bufferPBTransform.toBinary(), currentOffset: 0 }
    })
    const dtDeserializePBTransform = measureTime(() => {
      for (let i = 0; i < TransformTestCount; i++) {
        PBTransform.deserialize(ecsTypePBTransformBuffer)
      }
    })

    console.log(
      ` Deserialization ${TransformTestCount} Transforms component:
          Time:
          - EcsType with optional ${dtDeserializeTransform}ms
          - Flatbuffer ${dtDeserializeFBTransform}ms
          - Protobuffer ${dtDeserializePBTransform}ms
      `
    )
  })

  it('fake case, using bytebuffer without realloc for transform and builder for fbtransform', () => {
    const buffer = createByteBuffer({
      initialCapacity: TransformBufferInitialCapacity
    })

    const valueTransform: LegacyTransform = {
      position: Vector3.Up(),
      rotation: Quaternion.Identity(),
      scale: Vector3.One()
    }

    // Transform
    const dtTransform = measureTime(() => {
      for (let i = 0; i < TransformTestCount; i++) {
        Transform.serialize(valueTransform, buffer)
      }
    })

    function TransformToFBTransformT(value: LegacyTransform) {
      return new FBTransformT(
        new Vector3T(value.position.x, value.position.y, value.position.z),
        new QuaternionT(
          value.rotation.x,
          value.rotation.y,
          value.rotation.z,
          value.rotation.w
        ),
        new Vector3T(value.scale.x, value.scale.y, value.scale.z)
      )
    }

    // FlatBuffer Transform
    const fbValueTransform = TransformToFBTransformT(valueTransform)
    const builder = new Builder()
    const dtFBTransform = measureTime(() => {
      for (let i = 0; i < TransformTestCount; i++) {
        fbValueTransform.pack(builder)
      }
    })

    console.log(
      ` Serialization ${TransformTestCount} transforms using Bytebufffer and builder for flatbuffer:
          Time:
          - Raw ${dtTransform}ms
          - Flatbuffer ${dtFBTransform}ms
          Size:
          - Raw ${buffer.incrementWriteOffset(0).toLocaleString()} bytes
          - Flatbuffer ${builder.offset()} bytes
      `
    )
  })
})
