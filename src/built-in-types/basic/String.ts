import { Parser } from '../../serialization/Parser'
import { Serializer } from '../../serialization/Serializer'
import { EcsType } from '../EcsType'

export const FlatString: EcsType<string> = {
  serialize(value: string, builder: Serializer): void {
    const stringEncoded = new TextEncoder().encode(value)
    builder.bb.writeUint32(stringEncoded.length)
    builder.bb
      .buffer()
      .set(stringEncoded, builder.bb.reserve(stringEncoded.length))
  },
  deserialize(reader: Parser): string {
    const length = reader.bb.readUint32()

    const stringBuffer = reader.bb
      .buffer()
      .subarray(reader.bb.offset(), reader.bb.offset() + length)

    const stringDecoded = new TextDecoder().decode(stringBuffer)

    reader.bb.reserve(length)
    return stringDecoded
  }
}

// export const IndirectString: EcsType<string> = {
//   serialize(value: string, builder: Serializer): void {
//     const offset = [builder.bb.reserve(4)]

//     builder.push(() => {
//       // builder.bb.writeUint32(offset[0], builder.bb.offset())

//       const stringEncoded = new TextEncoder().encode(value)
//       // builder.bb.writeUint32(builder.bb.reserve(4), stringEncoded.length)

//       const stringOffset = builder.bb.reserve(stringEncoded.length)
//       builder.bb.buffer().set(stringEncoded, stringOffset)
//     })
//   },
//   deserialize(reader: Parser): string {
//     const offset = reader.bb.readUint32()
//     // const length = reader.bb.readUint32(offset)

//     // const stringBuffer = reader.dataView
//     // .buffer()
//     // .subarray(offset + 4, offset + 4 + length)
//     // const stringDecoded = new TextDecoder().decode(stringBuffer)

//     return ''
//   }
// }

export const String = FlatString
