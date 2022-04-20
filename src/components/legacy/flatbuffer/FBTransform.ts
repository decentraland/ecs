import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../../../built-in-types/EcsType'
import { ByteBuffer } from '../../../serialization/ByteBuffer'
import {
  FBTransform as fbFBTransform,
  FBTransformT
} from './fb-generated/f-b-transform'
import { QuaternionT } from './fb-generated/quaternion'
import { Vector3T } from './fb-generated/vector3'

export const COMPONENT_ID = 997

type Type = number | boolean

type FromClass<T> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K]
    : T[K] extends Type
    ? T[K]
    : never
}

type FBTransform = {
  position: Vector3.MutableVector3
  rotation: Quaternion.MutableQuaternion
  scale: Vector3.MutableVector3
}

export const FBTransform: EcsType<FBTransform> = {
  serialize(value: FBTransform, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    fbBuilder.finish(
      FBTransformT.pack(
        fbBuilder,
        new FBTransformT(
          new Vector3T(value.position.x, value.position.y, value.position.z),
          new QuaternionT(
            value.rotation.x,
            value.rotation.y,
            value.rotation.z,
            value.rotation.w
          ),
          new Vector3T(value.scale.x, value.scale.y, value.scale.z)
        )
      )
    )
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): FBTransform {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    const value = fbFBTransform.getRootAsFBTransform(buf).unpack()
    // TODO: see performance
    return {} as any
    // return { ...fbFBTransform.getRootAsFBTransform(buf).unpack() }
  }
}
