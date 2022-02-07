import ByteBuffer from "bytebuffer"

export type Parser = {
    bb: ByteBuffer
}

export function createParser(dataArray: Uint8Array): Parser {
    const buffer = ByteBuffer.fromBinary(new TextDecoder().decode(dataArray))
    return {
        bb: buffer
    }
}