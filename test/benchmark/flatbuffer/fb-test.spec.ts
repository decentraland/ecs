import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { Builder } from 'flatbuffers'
import { measureTime } from '../utils'
import { FBTransform } from './component/FBTransform'
import { Transform } from './component/Transform'
import { FBTransformT } from './fb-generated/f-b-transform'
import { QuaternionT } from './fb-generated/quaternion'
import { Vector3T } from './fb-generated/vector3'
import { createByteBuffer } from './package/ByteBuffer'

type LegacyTransform = ReturnType<typeof Transform['deserialize']>

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

describe('benchmark ', () => {
  it('real case, only using bytebuffer without realloc', () => {
    const N = 10003

    const valueTransform: LegacyTransform = {
      position: Vector3.Up(),
      rotation: Quaternion.Identity(),
      scale: Vector3.One()
    }

    // Transform
    const buffer1 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtTransform = measureTime(() => {
      for (let i = 0; i < N; i++) {
        Transform.serialize(valueTransform, buffer1)
      }
    })

    // FlatBuffer Transform
    const buffer2 = createByteBuffer({ initialCapacity: N * 40 * 100 })
    const dtFBTransform = measureTime(() => {
      for (let i = 0; i < N; i++) {
        FBTransform.serialize(valueTransform, buffer2)
      }
    })

    console.log(
      ` Serialization ${N} transforms using only Bytebufffer:
          Time:
          - Raw ${dtTransform}ms
          - Flatbuffer ${dtFBTransform}ms
          Size:
          - Raw ${buffer1.incrementWriteOffset(0)} bytes
          - Flatbuffer ${buffer2.incrementWriteOffset(0)} bytes
      `
    )
  })

  it('fake case, using bytebuffer without realloc for transform and builder for fbtransform', () => {
    const N = 10003
    const buffer = createByteBuffer({ initialCapacity: N * 40 })

    const valueTransform: LegacyTransform = {
      position: Vector3.Up(),
      rotation: Quaternion.Identity(),
      scale: Vector3.One()
    }

    // Transform
    const dtTransform = measureTime(() => {
      for (let i = 0; i < N; i++) {
        Transform.serialize(valueTransform, buffer)
      }
    })

    // FlatBuffer Transform
    const fbValueTransform = TransformToFBTransformT(valueTransform)
    const builder = new Builder()
    const dtFBTransform = measureTime(() => {
      for (let i = 0; i < N; i++) {
        fbValueTransform.pack(builder)
      }
    })

    console.log(
      ` Serialization ${N} transforms using Bytebufffer and builder for flatbuffer:
          Time:
          - Raw ${dtTransform}ms
          - Flatbuffer ${dtFBTransform}ms
          Size:
          - Raw ${buffer.incrementWriteOffset(0)} bytes
          - Flatbuffer ${builder.offset()} bytes
      `
    )
  })
})
