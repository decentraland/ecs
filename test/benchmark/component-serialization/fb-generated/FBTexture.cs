// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

using global::System;
using global::System.Collections.Generic;
using global::FlatBuffers;

public struct FBTexture : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_2_0_0(); }
  public static FBTexture GetRootAsFBTexture(ByteBuffer _bb) { return GetRootAsFBTexture(_bb, new FBTexture()); }
  public static FBTexture GetRootAsFBTexture(ByteBuffer _bb, FBTexture obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public FBTexture __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public string Src { get { int o = __p.__offset(4); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetSrcBytes() { return __p.__vector_as_span<byte>(4, 1); }
#else
  public ArraySegment<byte>? GetSrcBytes() { return __p.__vector_as_arraysegment(4); }
#endif
  public byte[] GetSrcArray() { return __p.__vector_as_array<byte>(4); }
  public int SamplingMode { get { int o = __p.__offset(6); return o != 0 ? __p.bb.GetInt(o + __p.bb_pos) : (int)0; } }
  public int Wrap { get { int o = __p.__offset(8); return o != 0 ? __p.bb.GetInt(o + __p.bb_pos) : (int)0; } }
  public bool HasAlpha { get { int o = __p.__offset(10); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }

  public static Offset<FBTexture> CreateFBTexture(FlatBufferBuilder builder,
      StringOffset srcOffset = default(StringOffset),
      int sampling_mode = 0,
      int wrap = 0,
      bool has_alpha = false) {
    builder.StartTable(4);
    FBTexture.AddWrap(builder, wrap);
    FBTexture.AddSamplingMode(builder, sampling_mode);
    FBTexture.AddSrc(builder, srcOffset);
    FBTexture.AddHasAlpha(builder, has_alpha);
    return FBTexture.EndFBTexture(builder);
  }

  public static void StartFBTexture(FlatBufferBuilder builder) { builder.StartTable(4); }
  public static void AddSrc(FlatBufferBuilder builder, StringOffset srcOffset) { builder.AddOffset(0, srcOffset.Value, 0); }
  public static void AddSamplingMode(FlatBufferBuilder builder, int samplingMode) { builder.AddInt(1, samplingMode, 0); }
  public static void AddWrap(FlatBufferBuilder builder, int wrap) { builder.AddInt(2, wrap, 0); }
  public static void AddHasAlpha(FlatBufferBuilder builder, bool hasAlpha) { builder.AddBool(3, hasAlpha, false); }
  public static Offset<FBTexture> EndFBTexture(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<FBTexture>(o);
  }
  public FBTextureT UnPack() {
    var _o = new FBTextureT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(FBTextureT _o) {
    _o.Src = this.Src;
    _o.SamplingMode = this.SamplingMode;
    _o.Wrap = this.Wrap;
    _o.HasAlpha = this.HasAlpha;
  }
  public static Offset<FBTexture> Pack(FlatBufferBuilder builder, FBTextureT _o) {
    if (_o == null) return default(Offset<FBTexture>);
    var _src = _o.Src == null ? default(StringOffset) : builder.CreateString(_o.Src);
    return CreateFBTexture(
      builder,
      _src,
      _o.SamplingMode,
      _o.Wrap,
      _o.HasAlpha);
  }
};

public class FBTextureT
{
  public string Src { get; set; }
  public int SamplingMode { get; set; }
  public int Wrap { get; set; }
  public bool HasAlpha { get; set; }

  public FBTextureT() {
    this.Src = null;
    this.SamplingMode = 0;
    this.Wrap = 0;
    this.HasAlpha = false;
  }
}

