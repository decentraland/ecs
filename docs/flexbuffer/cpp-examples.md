
## Types and bit width
```cpp

// There is a byte reserved to put the BitWidth and type.
// The byte has 8 bits, in this case: 6 bits are for the Type and the others 2 for bit width => 0bTTTTTTBB
// 6 bits = from 0 to 63
// the other 2 bits = from 0 to 3

// To fast-read this byte, look for the lower  4-multiply for the type, and sub this number to get bitwidth

enum BitWidth {
  BIT_WIDTH_8 = 0,
  BIT_WIDTH_16 = 1,
  BIT_WIDTH_32 = 2,
  BIT_WIDTH_64 = 3,
};


enum Type {
  FBT_NULL = 0,
  FBT_INT = 1,
  FBT_UINT = 2,
  FBT_FLOAT = 3,
  // Types above stored inline, types below (except FBT_BOOL) store an offset.
  FBT_KEY = 4,
  FBT_STRING = 5,
  FBT_INDIRECT_INT = 6,
  FBT_INDIRECT_UINT = 7,
  FBT_INDIRECT_FLOAT = 8,
  FBT_MAP = 9,
  FBT_VECTOR = 10,      // Untyped.
  FBT_VECTOR_INT = 11,  // Typed any size (stores no type table).
  FBT_VECTOR_UINT = 12,
  FBT_VECTOR_FLOAT = 13,
  FBT_VECTOR_KEY = 14,
  // DEPRECATED, use FBT_VECTOR or FBT_VECTOR_KEY instead.
  // Read test.cpp/FlexBuffersDeprecatedTest() for details on why.
  FBT_VECTOR_STRING_DEPRECATED = 15,
  FBT_VECTOR_INT2 = 16,  // Typed tuple (no type table, no size field).
  FBT_VECTOR_UINT2 = 17,
  FBT_VECTOR_FLOAT2 = 18,
  FBT_VECTOR_INT3 = 19,  // Typed triple (no type table, no size field).
  FBT_VECTOR_UINT3 = 20,
  FBT_VECTOR_FLOAT3 = 21,
  FBT_VECTOR_INT4 = 22,  // Typed quad (no type table, no size field).
  FBT_VECTOR_UINT4 = 23,
  FBT_VECTOR_FLOAT4 = 24,
  FBT_BLOB = 25,
  FBT_BOOL = 26,
  FBT_VECTOR_BOOL =
      36,  // To Allow the same type of conversion of type to vector type

  FBT_MAX_TYPE = 37
};
```

## Some basic type examples

### `fbb.Int(0x79);`
```typescript
UInt8Array(3) [121, 4, 1]
// 121 data
// 4 * (1 type_int) + 0 bitwidth_8
// 1 size
```
  

### `fbb.Int(0x7979);`
```typescript
UInt8Array(4) [121, 121, 5, 2]
// 121 121 data
// 5 = 4 * (1 type_int) + 1 bitwidth_16
// 2 size
```

### `fbb.Int(0x797979);`
```typescript
UInt8Array(6) [121, 121, 121, 0, 6, 4]
// 121 121 121 0 data
// 6 = 4 * (1 type_int) + 2 bitwidth_32
// 4 size
```

### `fbb.Int(0x79797979);`
```typescript
UInt8Array(6) [121, 121, 121, 121, 6, 4]
// 121 121 121 121 data
// 6 = 4 * (1 type_int) + 2 bitwidth_32
// 4 size
```

### `fbb.Int(0x7979797979); // 5 bytes`
```typescript
UInt8Array(10) [121, 121, 121, 121, 121, 0, 0, 0, 7, 8]
// 121 121 121 121 121 0 0 0 = data
// 7 = 4 * (1 type_int) + 3 bitwidth_64
// 8 size
```

### `fbb.Int(0x7979797979797979); // 8 bytes`
```typescript
UInt8Array(10) [121, 121, 121, 121, 121, 121, 121, 121, 7, 8]
// 121 121 121 121 121 121 121 121 = data
// 7 = 4 * (1 type_int) + 3 bitwidth_64
// 8 size
```

### `fbb.Add(3.5f);`
```typescript
// The 3.5f value is a 32bit float (IEEE-754) with its hexa representation 0x40600000 = 0x 40 60 00 00 = decimal 64 96 00 00

UInt8Array(6) [0, 0, 96, 64, 14, 4]
// 0 0 96 64 = data
// 14 = 4 * (3 type_float) + 2 bitwidth_32
// 4 data size
```

### `fbb.Add(3.1697671868139914781140387095E270);`
```typescript
// Double precision 
// hex representation: 0x7818000000000000
// dec: 120 24 00 00 00 00 00 00
UInt8Array(10) [0, 0, 0, 0, 0, 0, 24, 120, 15, 8]
// 0 0 0 0 0 0 24 120 = data
// 15 = 4 * (3 type_float) + 3 bitwidth_64
// 8 data size
```

### `fbb.String("hello");  // (string length = 5)`
```typescript
// hello in ascii: 104, 101, 108, 108, 111
UInt8Array(10) [5, 104, 101, 108, 108, 111, 0, 6, 20, 1]
// 5 104 101 108 108 111 0 = data (length_bitwidth8 + raw_char)
// 0 = end of string?? the same width like length
// 6 = total length
// 20 = 4 * (5 type_string) + 0 bitwidth_8 (of length)
// 1 data size (root size which is the length)
```

### `fbb.String("decentraland"); // (string length = 12)`
```typescript
// decentraland in ascii: 100, 101, 99, 101, 110, 116, 114, 97, 108, 97, 110, 100
UInt8Array(17) [12, 100, 101, 99, 101, 110, 116, 114, 97, 108, 97, 110, 100, 0, 13, 20, 1]
// 12 100 101 99 101 110 116 114 97 108 97 110 100 = data (length_bitwidth8 + raw_char)
// 0 = end of string?? the same width like length
// 13 = total length
// 20 = 4 * (5 type_string) + 0 bitwidth_8 (of length)
// 1 data size (root size which is the length byte)
```

### `fbb.String(longString); length 282= 01 1A = 1 26`
```typescript
// The length of longString is 282 which its representation in hexa is 0x011A = 01 1A => decimal 01 26 (little endian)  

// string "aaaDecentraland is a 3D virtual world platform. Users may buy virtual plots of land in the platform as NFTs via the MANA cryptocurrency, which uses the Ethereum blockchain. It was opened to the public in February 2020,[2] and is overseen by the nonprofit Decentraland Foundation.bbb"

UInt8Array(290) [26, 1, 97, 97, 97, 68, 101, 99, 101, 110, 116, 
	114, 97, 108, 97, 110, 100, 32, 105, 115, 32, 
	97, 32, 51, 68, 32, 118, 105, 114, 116, 117, 
	97, 108, 32, 119, 111, 114, 108, 100, 32, 112, 
	108, 97, 116, 102, 111, 114, 109, 46, 32, 85, 
	115, 101, 114, 115, 32, 109, 97, 121, 32, 98, 
	117, 121, 32, 118, 105, 114, 116, 117, 97, 108, 
	32, 112, 108, 111, 116, 115, 32, 111, 102, 32, 
	108, 97, 110, 100, 32, 105, 110, 32, 116, 104, 
	101, 32, 112, 108, 97, 116, 102, 111, 114, 109, 
	32, 97, 115, 32, 78, 70, 84, 115, 32, 118, 
	105, 97, 32, 116, 104, 101, 32, 77, 65, 78, 
	65, 32, 99, 114, 121, 112, 116, 111, 99, 117, 
	114, 114, 101, 110, 99, 121, 44, 32, 119, 104, 
	105, 99, 104, 32, 117, 115, 101, 115, 32, 116, 
	104, 101, 32, 69, 116, 104, 101, 114, 101, 117, 
	109, 32, 98, 108, 111, 99, 107, 99, 104, 97, 
	105, 110, 46, 32, 73, 116, 32, 119, 97, 115, 
	32, 111, 112, 101, 110, 101, 100, 32, 116, 111, 
	32, 116, 104, 101, 32, 112, 117, 98, 108, 105, 
	99, 32, 105, 110, 32, 70, 101, 98, 114, 117, 
	97, 114, 121, 32, 50, 48, 50, 48, 44, 91, 
	50, 93, 32, 97, 110, 100, 32, 105, 115, 32, 
	111, 118, 101, 114, 115, 101, 101, 110, 32, 98, 
	121, 32, 116, 104, 101, 32, 110, 111, 110, 112, 
	114, 111, 102, 105, 116, 32, 68, 101, 99, 101, 
	110, 116, 114, 97, 108, 97, 110, 100, 32, 70, 
	111, 117, 110, 100, 97, 116, 105, 111, 110, 46, 
	98, 98, 98, 0, 0, 28, 1, 21, 2]

// 26 1 97 97 ... ... 98 98 = data (length_bitwidth16 + raw_char )
// 0 0 = end of string?? the same width like length
// 28 1 = total length (raw data + 2byte of length)
// 21 = 4 * (5 type_string) + 1 bitwidth_16 (of length)
// 2 data size (root size which is the length 2byte)
```


## Vector with all others calls
```cpp
fbb.Vector([&]() {
    fbb.Int(0x79);
    fbb.Int(0x7979);
    fbb.Int(0x797979);
    fbb.Int(0x7979797979);
    fbb.Int(0x7979797979797979);
    fbb.Add(3.5f);
    fbb.Add(3.1697671868139914781140387095E270);
    fbb.String("hello");
    fbb.String("decentraland");

    std::string longString = "aaaDecentraland is a 3D virtual world platform. Users may buy virtual plots of land in the platform as NFTs via the MANA cryptocurrency, which uses the Ethereum blockchain. It was opened to the public in February 2020,[2] and is overseen by the nonprofit Decentraland Foundation.bbb";
    fbb.String(longString);
});
```

```typescript
UInt8Array(413) [5, 104, 101, 108, 108, 111, 0, 12, 100, 101, 99, 
	101, 110, 116, 114, 97, 108, 97, 110, 100, 0, 
	0, 26, 1, 97, 97, 97, 68, 101, 99, 101, 
	110, 116, 114, 97, 108, 97, 110, 100, 32, 105, 
	115, 32, 97, 32, 51, 68, 32, 118, 105, 114, 
	116, 117, 97, 108, 32, 119, 111, 114, 108, 100, 
	32, 112, 108, 97, 116, 102, 111, 114, 109, 46, 
	32, 85, 115, 101, 114, 115, 32, 109, 97, 121, 
	32, 98, 117, 121, 32, 118, 105, 114, 116, 117, 
	97, 108, 32, 112, 108, 111, 116, 115, 32, 111, 
	102, 32, 108, 97, 110, 100, 32, 105, 110, 32, 
	116, 104, 101, 32, 112, 108, 97, 116, 102, 111, 
	114, 109, 32, 97, 115, 32, 78, 70, 84, 115, 
	32, 118, 105, 97, 32, 116, 104, 101, 32, 77, 
	65, 78, 65, 32, 99, 114, 121, 112, 116, 111, 
	99, 117, 114, 114, 101, 110, 99, 121, 44, 32, 
	119, 104, 105, 99, 104, 32, 117, 115, 101, 115, 
	32, 116, 104, 101, 32, 69, 116, 104, 101, 114, 
	101, 117, 109, 32, 98, 108, 111, 99, 107, 99, 
	104, 97, 105, 110, 46, 32, 73, 116, 32, 119, 
	97, 115, 32, 111, 112, 101, 110, 101, 100, 32, 
	116, 111, 32, 116, 104, 101, 32, 112, 117, 98, 
	108, 105, 99, 32, 105, 110, 32, 70, 101, 98, 
	114, 117, 97, 114, 121, 32, 50, 48, 50, 48, 
	44, 91, 50, 93, 32, 97, 110, 100, 32, 105, 
	115, 32, 111, 118, 101, 114, 115, 101, 101, 110, 
	32, 98, 121, 32, 116, 104, 101, 32, 110, 111, 
	110, 112, 114, 111, 102, 105, 116, 32, 68, 101, 
	99, 101, 110, 116, 114, 97, 108, 97, 110, 100, 
	32, 70, 111, 117, 110, 100, 97, 116, 105, 111, 
	110, 46, 98, 98, 98, 0, 0, 0, 0, 0, 
	0, 10, 0, 0, 0, 0, 0, 0, 0, 121, 
	0, 0, 0, 0, 0, 0, 0, 121, 121, 0, 
	0, 0, 0, 0, 0, 121, 121, 121, 0, 0, 
	0, 0, 0, 121, 121, 121, 121, 121, 0, 0, 
	0, 121, 121, 121, 121, 121, 121, 121, 121, 0, 
	0, 0, 0, 0, 0, 12, 64, 0, 0, 0, 
	0, 0, 0, 24, 120, 119, 1, 0, 0, 0, 
	0, 0, 0, 120, 1, 0, 0, 0, 0, 0, 
	0, 112, 1, 0, 0, 0, 0, 0, 0, 7, 
	7, 7, 7, 7, 15, 15, 20, 20, 21, 90, 43, 1]
```