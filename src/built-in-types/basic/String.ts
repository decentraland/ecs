import { Parser } from '../../serialization/Parser'
import { Serializer } from '../../serialization/Serializer'
import { EcsType } from '../EcsType'

export const FlatString: EcsType<string> = {
  serialize(value: string, builder: Serializer): void {
    const stringEncoded = new TextEncoder().encode(value)

    builder.dataView.view.setUint32(
      builder.dataView.poffset(4),
      stringEncoded.length
    )

    const stringOffset = builder.dataView.poffset(stringEncoded.length)
    builder.dataView.buffer().set(stringEncoded, stringOffset)
  },
  deserialize(reader: Parser): string {
    const length = reader.dataView.view.getUint32(reader.dataView.poffset(4))

    const stringBuffer = reader.dataView
      .buffer()
      .subarray(reader.dataView.offset(), reader.dataView.offset() + length)
    const stringDecoded = new TextDecoder().decode(stringBuffer)

    return stringDecoded
  }
}

export const IndirectString: EcsType<string> = {
  serialize(value: string, builder: Serializer): void {
    const offset = [builder.dataView.poffset(4)]

    builder.push(() => {
      builder.dataView.view.setUint32(offset[0], builder.dataView.offset())

      const stringEncoded = new TextEncoder().encode(value)
      builder.dataView.view.setUint32(
        builder.dataView.poffset(4),
        stringEncoded.length
      )

      const stringOffset = builder.dataView.poffset(stringEncoded.length)
      builder.dataView.buffer().set(stringEncoded, stringOffset)
    })
  },
  deserialize(reader: Parser): string {
    const offset = reader.dataView.view.getUint32(reader.dataView.poffset(4))
    const length = reader.dataView.view.getUint32(offset)

    const stringBuffer = reader.dataView
      .buffer()
      .subarray(offset + 4, offset + 4 + length)
    const stringDecoded = new TextDecoder().decode(stringBuffer)

    return stringDecoded
  }
}

export const String = IndirectString
