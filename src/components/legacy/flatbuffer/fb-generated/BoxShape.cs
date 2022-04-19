// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

using global::System;
using global::System.Collections.Generic;
using global::FlatBuffers;

public struct BoxShape : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_2_0_0(); }
  public static BoxShape GetRootAsBoxShape(ByteBuffer _bb) { return GetRootAsBoxShape(_bb, new BoxShape()); }
  public static BoxShape GetRootAsBoxShape(ByteBuffer _bb, BoxShape obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public BoxShape __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public bool WithCollisions { get { int o = __p.__offset(4); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }
  public bool IsPointerBlocker { get { int o = __p.__offset(6); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }
  public bool Visible { get { int o = __p.__offset(8); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }
  public float Uvs(int j) { int o = __p.__offset(10); return o != 0 ? __p.bb.GetFloat(__p.__vector(o) + j * 4) : (float)0; }
  public int UvsLength { get { int o = __p.__offset(10); return o != 0 ? __p.__vector_len(o) : 0; } }
#if ENABLE_SPAN_T
  public Span<float> GetUvsBytes() { return __p.__vector_as_span<float>(10, 4); }
#else
  public ArraySegment<byte>? GetUvsBytes() { return __p.__vector_as_arraysegment(10); }
#endif
  public float[] GetUvsArray() { return __p.__vector_as_array<float>(10); }

  public static Offset<BoxShape> CreateBoxShape(FlatBufferBuilder builder,
      bool with_collisions = false,
      bool is_pointer_blocker = false,
      bool visible = false,
      VectorOffset uvsOffset = default(VectorOffset)) {
    builder.StartTable(4);
    BoxShape.AddUvs(builder, uvsOffset);
    BoxShape.AddVisible(builder, visible);
    BoxShape.AddIsPointerBlocker(builder, is_pointer_blocker);
    BoxShape.AddWithCollisions(builder, with_collisions);
    return BoxShape.EndBoxShape(builder);
  }

  public static void StartBoxShape(FlatBufferBuilder builder) { builder.StartTable(4); }
  public static void AddWithCollisions(FlatBufferBuilder builder, bool withCollisions) { builder.AddBool(0, withCollisions, false); }
  public static void AddIsPointerBlocker(FlatBufferBuilder builder, bool isPointerBlocker) { builder.AddBool(1, isPointerBlocker, false); }
  public static void AddVisible(FlatBufferBuilder builder, bool visible) { builder.AddBool(2, visible, false); }
  public static void AddUvs(FlatBufferBuilder builder, VectorOffset uvsOffset) { builder.AddOffset(3, uvsOffset.Value, 0); }
  public static VectorOffset CreateUvsVector(FlatBufferBuilder builder, float[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddFloat(data[i]); return builder.EndVector(); }
  public static VectorOffset CreateUvsVectorBlock(FlatBufferBuilder builder, float[] data) { builder.StartVector(4, data.Length, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreateUvsVectorBlock(FlatBufferBuilder builder, ArraySegment<float> data) { builder.StartVector(4, data.Count, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreateUvsVectorBlock(FlatBufferBuilder builder, IntPtr dataPtr, int sizeInBytes) { builder.StartVector(1, sizeInBytes, 1); builder.Add<float>(dataPtr, sizeInBytes); return builder.EndVector(); }
  public static void StartUvsVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static Offset<BoxShape> EndBoxShape(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<BoxShape>(o);
  }
  public static void FinishBoxShapeBuffer(FlatBufferBuilder builder, Offset<BoxShape> offset) { builder.Finish(offset.Value); }
  public static void FinishSizePrefixedBoxShapeBuffer(FlatBufferBuilder builder, Offset<BoxShape> offset) { builder.FinishSizePrefixed(offset.Value); }
  public BoxShapeT UnPack() {
    var _o = new BoxShapeT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(BoxShapeT _o) {
    _o.WithCollisions = this.WithCollisions;
    _o.IsPointerBlocker = this.IsPointerBlocker;
    _o.Visible = this.Visible;
    _o.Uvs = new List<float>();
    for (var _j = 0; _j < this.UvsLength; ++_j) {_o.Uvs.Add(this.Uvs(_j));}
  }
  public static Offset<BoxShape> Pack(FlatBufferBuilder builder, BoxShapeT _o) {
    if (_o == null) return default(Offset<BoxShape>);
    var _uvs = default(VectorOffset);
    if (_o.Uvs != null) {
      var __uvs = _o.Uvs.ToArray();
      _uvs = CreateUvsVector(builder, __uvs);
    }
    return CreateBoxShape(
      builder,
      _o.WithCollisions,
      _o.IsPointerBlocker,
      _o.Visible,
      _uvs);
  }
}

public class BoxShapeT
{
  public bool WithCollisions { get; set; }
  public bool IsPointerBlocker { get; set; }
  public bool Visible { get; set; }
  public List<float> Uvs { get; set; }

  public BoxShapeT() {
    this.WithCollisions = false;
    this.IsPointerBlocker = false;
    this.Visible = false;
    this.Uvs = null;
  }
  public static BoxShapeT DeserializeFromBinary(byte[] fbBuffer) {
    return BoxShape.GetRootAsBoxShape(new ByteBuffer(fbBuffer)).UnPack();
  }
  public byte[] SerializeToBinary() {
    var fbb = new FlatBufferBuilder(0x10000);
    BoxShape.FinishBoxShapeBuffer(fbb, BoxShape.Pack(fbb, this));
    return fbb.DataBuffer.ToSizedArray();
  }
}

