// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

using global::System;
using global::System.Collections.Generic;
using global::FlatBuffers;

public struct FBColor4 : IFlatbufferObject
{
  private Struct __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public void __init(int _i, ByteBuffer _bb) { __p = new Struct(_i, _bb); }
  public FBColor4 __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public float R { get { return __p.bb.GetFloat(__p.bb_pos + 0); } }
  public float G { get { return __p.bb.GetFloat(__p.bb_pos + 4); } }
  public float B { get { return __p.bb.GetFloat(__p.bb_pos + 8); } }
  public float A { get { return __p.bb.GetFloat(__p.bb_pos + 12); } }

  public static Offset<FBColor4> CreateFBColor4(FlatBufferBuilder builder, float R, float G, float B, float A) {
    builder.Prep(4, 16);
    builder.PutFloat(A);
    builder.PutFloat(B);
    builder.PutFloat(G);
    builder.PutFloat(R);
    return new Offset<FBColor4>(builder.Offset);
  }
  public FBColor4T UnPack() {
    var _o = new FBColor4T();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(FBColor4T _o) {
    _o.R = this.R;
    _o.G = this.G;
    _o.B = this.B;
    _o.A = this.A;
  }
  public static Offset<FBColor4> Pack(FlatBufferBuilder builder, FBColor4T _o) {
    if (_o == null) return default(Offset<FBColor4>);
    return CreateFBColor4(
      builder,
      _o.R,
      _o.G,
      _o.B,
      _o.A);
  }
};

public class FBColor4T
{
  public float R { get; set; }
  public float G { get; set; }
  public float B { get; set; }
  public float A { get; set; }

  public FBColor4T() {
    this.R = 0.0f;
    this.G = 0.0f;
    this.B = 0.0f;
    this.A = 0.0f;
  }
}

