import ByteBuffer from "bytebuffer"

export type Parser = {
    bb: ByteBuffer
}

export function createParser(dataArray: Uint8Array): Parser {

    // TODO: implement better way (replacing Bytebuffer approach)
    const buffer = ByteBuffer.allocate(dataArray.length, false, false)
    for (const byte of dataArray){
        buffer.writeByte(byte)
    }
    buffer.reset()

    return {
        bb: buffer
    }
}