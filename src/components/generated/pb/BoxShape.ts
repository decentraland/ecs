/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "decentraland.ecs";

export interface PBBoxShape {
  withCollisions: boolean;
  isPointerBlocker: boolean;
  visible: boolean;
  uvs: number[];
}

function createBasePBBoxShape(): PBBoxShape {
  return {
    withCollisions: false,
    isPointerBlocker: false,
    visible: false,
    uvs: [],
  };
}

export const PBBoxShape = {
  encode(
    message: PBBoxShape,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.withCollisions === true) {
      writer.uint32(8).bool(message.withCollisions);
    }
    if (message.isPointerBlocker === true) {
      writer.uint32(16).bool(message.isPointerBlocker);
    }
    if (message.visible === true) {
      writer.uint32(24).bool(message.visible);
    }
    writer.uint32(34).fork();
    for (const v of message.uvs) {
      writer.float(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PBBoxShape {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePBBoxShape();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withCollisions = reader.bool();
          break;
        case 2:
          message.isPointerBlocker = reader.bool();
          break;
        case 3:
          message.visible = reader.bool();
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.uvs.push(reader.float());
            }
          } else {
            message.uvs.push(reader.float());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
};
