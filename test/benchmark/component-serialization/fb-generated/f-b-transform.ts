// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { Quaternion, QuaternionT } from './quaternion';
import { Vector3, Vector3T } from './vector3';


export class FBTransform {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):FBTransform {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsFBTransform(bb:flatbuffers.ByteBuffer, obj?:FBTransform):FBTransform {
  return (obj || new FBTransform()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsFBTransform(bb:flatbuffers.ByteBuffer, obj?:FBTransform):FBTransform {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new FBTransform()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

position(obj?:Vector3):Vector3|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new Vector3()).__init(this.bb_pos + offset, this.bb!) : null;
}

rotation(obj?:Quaternion):Quaternion|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new Quaternion()).__init(this.bb_pos + offset, this.bb!) : null;
}

scale(obj?:Vector3):Vector3|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new Vector3()).__init(this.bb_pos + offset, this.bb!) : null;
}

static startFBTransform(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addPosition(builder:flatbuffers.Builder, positionOffset:flatbuffers.Offset) {
  builder.addFieldStruct(0, positionOffset, 0);
}

static addRotation(builder:flatbuffers.Builder, rotationOffset:flatbuffers.Offset) {
  builder.addFieldStruct(1, rotationOffset, 0);
}

static addScale(builder:flatbuffers.Builder, scaleOffset:flatbuffers.Offset) {
  builder.addFieldStruct(2, scaleOffset, 0);
}

static endFBTransform(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishFBTransformBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedFBTransformBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}


unpack(): FBTransformT {
  return new FBTransformT(
    (this.position() !== null ? this.position()!.unpack() : null),
    (this.rotation() !== null ? this.rotation()!.unpack() : null),
    (this.scale() !== null ? this.scale()!.unpack() : null)
  );
}


unpackTo(_o: FBTransformT): void {
  _o.position = (this.position() !== null ? this.position()!.unpack() : null);
  _o.rotation = (this.rotation() !== null ? this.rotation()!.unpack() : null);
  _o.scale = (this.scale() !== null ? this.scale()!.unpack() : null);
}
}

export class FBTransformT {
constructor(
  public position: Vector3T|null = null,
  public rotation: QuaternionT|null = null,
  public scale: Vector3T|null = null
){}


pack(builder:flatbuffers.Builder): flatbuffers.Offset {
  FBTransform.startFBTransform(builder);
  FBTransform.addPosition(builder, (this.position !== null ? this.position!.pack(builder) : 0));
  FBTransform.addRotation(builder, (this.rotation !== null ? this.rotation!.pack(builder) : 0));
  FBTransform.addScale(builder, (this.scale !== null ? this.scale!.pack(builder) : 0));

  return FBTransform.endFBTransform(builder);
}
}
