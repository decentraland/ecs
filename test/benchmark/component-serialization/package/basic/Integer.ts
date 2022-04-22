import { ByteBuffer } from '../ByteBuffer'
import { EcsType } from '../EcsType'

export const BigInt64: EcsType<bigint> = {
  serialize(value: bigint, builder: ByteBuffer): void {
    builder.writeInt64(value)
  },
  deserialize(reader: ByteBuffer): bigint {
    return reader.readInt64()
  }
}

export const Int64: EcsType<number> = {
  serialize(value: number, builder: ByteBuffer): void {
    builder.writeInt64(BigInt(value))
  },
  deserialize(reader: ByteBuffer): number {
    return Number(reader.readInt64())
  }
}

export const Int32: EcsType<number> = {
  serialize(value: number, builder: ByteBuffer): void {
    builder.writeInt32(value)
  },
  deserialize(reader: ByteBuffer): number {
    return reader.readInt32()
  }
}

export const Int16: EcsType<number> = {
  serialize(value: number, builder: ByteBuffer): void {
    builder.writeInt16(value)
  },
  deserialize(reader: ByteBuffer): number {
    return reader.readInt16()
  }
}

export const Int8: EcsType<number> = {
  serialize(value: number, builder: ByteBuffer): void {
    builder.writeInt8(value)
  },
  deserialize(reader: ByteBuffer): number {
    return reader.readInt8()
  }
}

export const Boolean: EcsType<boolean> = {
  serialize(value: boolean, builder: ByteBuffer): void {
    builder.writeInt8(value ? 1 : 0)
  },
  deserialize(reader: ByteBuffer): boolean {
    return reader.readInt8() === 1
  }
}

export function Enum<T>(type: EcsType<any>): EcsType<T> {
  return {
    serialize(value: T, builder: ByteBuffer): void {
      type.serialize(value as any, builder)
    },
    deserialize(reader: ByteBuffer): T {
      return type.deserialize(reader)
    }
  }
}
