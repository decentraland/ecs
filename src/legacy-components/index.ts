import type { Engine } from "../engine";
import { BoxShape as LegacyBoxShape } from "./BoxShape";
import { Transform as LegacyTransform } from "./Transform";

/**
 * @public
 */
export enum LEGACY_CLASS_ID {
  TRANSFORM = 1,
  UUID_CALLBACK = 8,
  BOX_SHAPE = 16,
  SPHERE_SHAPE = 17,
  PLANE_SHAPE = 18,
  CONE_SHAPE = 19,
  CYLINDER_SHAPE = 20,
  TEXT_SHAPE = 21,

  NFT_SHAPE = 22,
  UI_WORLD_SPACE_SHAPE = 23,
  UI_SCREEN_SPACE_SHAPE = 24,
  UI_CONTAINER_RECT = 25,
  UI_CONTAINER_STACK = 26,
  UI_TEXT_SHAPE = 27,
  UI_INPUT_TEXT_SHAPE = 28,
  UI_IMAGE_SHAPE = 29,
  UI_SLIDER_SHAPE = 30,
  CIRCLE_SHAPE = 31,
  BILLBOARD = 32,

  ANIMATION = 33,
  FONT = 34,

  UI_FULLSCREEN_SHAPE = 40, // internal fullscreen scenes
  UI_BUTTON_SHAPE = 41,

  GLTF_SHAPE = 54,
  OBJ_SHAPE = 55,
  AVATAR_SHAPE = 56,

  BASIC_MATERIAL = 64,
  PBR_MATERIAL = 65,

  HIGHLIGHT_ENTITY = 66,

  /** @deprecated Sound has been deprecataed */
  SOUND = 67,
  TEXTURE = 68,

  VIDEO_CLIP = 70,
  VIDEO_TEXTURE = 71,

  AVATAR_TEXTURE = 72,

  AUDIO_CLIP = 200,
  AUDIO_SOURCE = 201,
  AUDIO_STREAM = 202,
  GIZMOS = 203,
  SMART_ITEM = 204,
  AVATAR_MODIFIER_AREA = 205,
  AVATAR_ATTACH = 206,
  CAMERA_MODE_AREA = 207,

  // For state sync only
  NAME = 300,
  LOCKED_ON_EDIT = 301,
  VISIBLE_ON_EDIT = 302
}

export function defineLegacyComponents(engine: Engine) {
  const Transform = engine.defineComponent(LEGACY_CLASS_ID.TRANSFORM, LegacyTransform)
  const BoxShape = engine.defineComponent(LEGACY_CLASS_ID.BOX_SHAPE, LegacyBoxShape)

  return {
    Transform,
    BoxShape
  }
}