import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../package/EcsType'
import { ByteBuffer } from '../package/ByteBuffer'
import {
  FBTransform as fbFBTransform,
  FBTransformT
} from '../fb-generated/f-b-transform'
import { QuaternionT } from '../fb-generated/quaternion'
import { Vector3T } from '../fb-generated/vector3'

type FBTransform = {
  position: Vector3.MutableVector3
  rotation: Quaternion.MutableQuaternion
  scale: Vector3.MutableVector3
}

export const FBTransform: EcsType<FBTransform> = {
  serialize(value: FBTransform, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    const fbValue = new FBTransformT(
      new Vector3T(value.position.x, value.position.y, value.position.z),
      new QuaternionT(
        value.rotation.x,
        value.rotation.y,
        value.rotation.z,
        value.rotation.w
      ),
      new Vector3T(value.scale.x, value.scale.y, value.scale.z)
    )

    fbBuilder.finish(fbValue.pack(fbBuilder))
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): FBTransform {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    const value = fbFBTransform.getRootAsFBTransform(buf).unpack()

    return {
      position: Vector3.create(
        value.position.x,
        value.position.y,
        value.position.z
      ),
      rotation: Quaternion.create(
        value.rotation.x,
        value.rotation.y,
        value.rotation.z,
        value.rotation.w
      ),
      scale: Vector3.create(value.scale.x, value.scale.y, value.scale.z)
    }
  }
}
