import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { Builder } from 'flatbuffers'
import { FBTransformT } from '../../src/components/legacy/flatbuffer/fb-generated/f-b-transform'
import { QuaternionT } from '../../src/components/legacy/flatbuffer/fb-generated/quaternion'
import { Vector3T } from '../../src/components/legacy/flatbuffer/fb-generated/vector3'
import { FBTransform } from '../../src/components/legacy/flatbuffer/FBTransform'
import { Transform } from '../../src/components/legacy/Transform'
import { Engine } from '../../src/engine'
import { createByteBuffer } from '../../src/serialization/ByteBuffer'

function measureTime(f: () => void) {
  const initialTime = performance.now()
  f()
  const dt = performance.now() - initialTime
  return dt
}

describe('benchmark ', () => {
  it('', () => {
    const serializationCount = 10003

    // Transform
    const valueTransform: ReturnType<typeof Transform['deserialize']> = {
      position: Vector3.Up(),
      rotation: Quaternion.Identity(),
      scale: Vector3.One()
    }
    const buffer = createByteBuffer()
    const dtTransform = measureTime(() => {
      for (let i = 0; i < serializationCount; i++) {
        Transform.serialize(valueTransform, buffer)
      }
    })

    // FlatBuffer Transform
    const fbBuilder = new Builder()
    const fbValue = new FBTransformT(
      new Vector3T(
        valueTransform.position.x,
        valueTransform.position.y,
        valueTransform.position.z
      ),
      new QuaternionT(
        valueTransform.rotation.x,
        valueTransform.rotation.y,
        valueTransform.rotation.z,
        valueTransform.rotation.w
      ),
      new Vector3T(
        valueTransform.scale.x,
        valueTransform.scale.y,
        valueTransform.scale.z
      )
    )
    const dtFBTransform = measureTime(() => {
      for (let i = 0; i < serializationCount; i++) {
        FBTransformT.pack(fbBuilder, fbValue)
      }
    })

    console.log(
      `The delta-time to serialize ${serializationCount} Transform is ${dtTransform}ms and size: ${buffer.incrementWriteOffset(
        0
      )}`
    )
    console.log(
      `The delta-time to serialize ${serializationCount} FBTransform is ${dtFBTransform}ms and size: ${fbBuilder.offset()}`
    )
  })
})
