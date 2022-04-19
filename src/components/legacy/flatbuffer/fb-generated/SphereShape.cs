// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

using global::System;
using global::System.Collections.Generic;
using global::FlatBuffers;

public struct SphereShape : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_2_0_0(); }
  public static SphereShape GetRootAsSphereShape(ByteBuffer _bb) { return GetRootAsSphereShape(_bb, new SphereShape()); }
  public static SphereShape GetRootAsSphereShape(ByteBuffer _bb, SphereShape obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public SphereShape __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public bool WithCollisions { get { int o = __p.__offset(4); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }
  public bool IsPointerBlocker { get { int o = __p.__offset(6); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }
  public bool Visible { get { int o = __p.__offset(8); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }

  public static Offset<SphereShape> CreateSphereShape(FlatBufferBuilder builder,
      bool with_collisions = false,
      bool is_pointer_blocker = false,
      bool visible = false) {
    builder.StartTable(3);
    SphereShape.AddVisible(builder, visible);
    SphereShape.AddIsPointerBlocker(builder, is_pointer_blocker);
    SphereShape.AddWithCollisions(builder, with_collisions);
    return SphereShape.EndSphereShape(builder);
  }

  public static void StartSphereShape(FlatBufferBuilder builder) { builder.StartTable(3); }
  public static void AddWithCollisions(FlatBufferBuilder builder, bool withCollisions) { builder.AddBool(0, withCollisions, false); }
  public static void AddIsPointerBlocker(FlatBufferBuilder builder, bool isPointerBlocker) { builder.AddBool(1, isPointerBlocker, false); }
  public static void AddVisible(FlatBufferBuilder builder, bool visible) { builder.AddBool(2, visible, false); }
  public static Offset<SphereShape> EndSphereShape(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<SphereShape>(o);
  }
  public static void FinishSphereShapeBuffer(FlatBufferBuilder builder, Offset<SphereShape> offset) { builder.Finish(offset.Value); }
  public static void FinishSizePrefixedSphereShapeBuffer(FlatBufferBuilder builder, Offset<SphereShape> offset) { builder.FinishSizePrefixed(offset.Value); }
  public SphereShapeT UnPack() {
    var _o = new SphereShapeT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(SphereShapeT _o) {
    _o.WithCollisions = this.WithCollisions;
    _o.IsPointerBlocker = this.IsPointerBlocker;
    _o.Visible = this.Visible;
  }
  public static Offset<SphereShape> Pack(FlatBufferBuilder builder, SphereShapeT _o) {
    if (_o == null) return default(Offset<SphereShape>);
    return CreateSphereShape(
      builder,
      _o.WithCollisions,
      _o.IsPointerBlocker,
      _o.Visible);
  }
}

public class SphereShapeT
{
  public bool WithCollisions { get; set; }
  public bool IsPointerBlocker { get; set; }
  public bool Visible { get; set; }

  public SphereShapeT() {
    this.WithCollisions = false;
    this.IsPointerBlocker = false;
    this.Visible = false;
  }
  public static SphereShapeT DeserializeFromBinary(byte[] fbBuffer) {
    return SphereShape.GetRootAsSphereShape(new ByteBuffer(fbBuffer)).UnPack();
  }
  public byte[] SerializeToBinary() {
    var fbb = new FlatBufferBuilder(0x10000);
    SphereShape.FinishSphereShapeBuffer(fbb, SphereShape.Pack(fbb, this));
    return fbb.DataBuffer.ToSizedArray();
  }
}

