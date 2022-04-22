export enum COMPONENT_ID {
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

/** @public */
export enum AvatarModifiers {
  HIDE_AVATARS = 'HIDE_AVATARS',
  DISABLE_PASSPORTS = 'DISABLE_PASSPORTS'
}

import { Quaternion, Vector3 } from '@dcl/ecs-math'

type Color3 = {
  r: number
  g: number
  b: number
}

type Color4 = Color3 & {
  a: number
}

type AvatarModifierArea = {
  area: {
    box: Vector3.MutableVector3
  }
  modifiers: AvatarModifiers[]
  excludeIds?: string[]
}

// @Component('engine.transform', COMPONENT_ID.TRANSFORM)
export type Transform = {
  position: Vector3.MutableVector3
  rotation: Quaternion.MutableQuaternion
  scale: Vector3.MutableVector3
}

export enum AttachToAvatarAnchorPointId {
  Position = 0,
  NameTag = 1,
  LeftHand = 2,
  RightHand = 3
}

export type AttachToAvatarConstructorArgs = {
  avatarId?: string
  anchorPointId?: AttachToAvatarAnchorPointId
}

// @Component('engine.transform', COMPONENT_ID.AVATAR_ATTACH)
export type AttachToAvatar = {
  avatarId: string
  anchorPointId: AttachToAvatarAnchorPointId
  avatarSceneId: 'dcl-gs-avatars'
}

// @Component('engine.billboard', COMPONENT_ID.BILLBOARD)
export type Billboard = {
  x: boolean
  y: boolean
  z: boolean
}

export type Shape = {
  withCollisions: boolean
  isPointerBlocker: boolean
  visible: boolean
}

/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.BOX_SHAPE)
export type BoxShape = Shape & {
  uvs?: number[]
}

/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.SPHERE_SHAPE)
export type SphereShape = Shape
/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.CIRCLE_SHAPE)
export type CircleShape = Shape & {
  segments?: number
  arc?: number
}

/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.PLANE_SHAPE)
export type PlaneShape = Shape & {
  width: number
  height: number
  uvs?: number[]
}

/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.CONE_SHAPE)
export type ConeShape = Shape & {
  radiusTop: number
  radiusBottom: number
  segmentsHeight: number
  segmentsRadial: number
  openEnded: boolean
  radius: number | null
  arc: number
}

/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.CYLINDER_SHAPE)
export type CylinderShape = Shape & {
  radiusTop: number
  radiusBottom: number
  segmentsHeight: number
  segmentsRadial: number
  openEnded: boolean
  radius: number | null
  arc: number
}

/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.GLTF_SHAPE)
export type GLTFShape = Shape & {
  readonly src: string
}

/** @public */
export enum PictureFrameStyle {
  Classic = 0,
  Baroque_Ornament = 1,
  Diamond_Ornament = 2,
  Minimal_Wide = 3,
  Minimal_Grey = 4,
  Blocky = 5,
  Gold_Edges = 6,
  Gold_Carved = 7,
  Gold_Wide = 8,
  Gold_Rounded = 9,
  Metal_Medium = 10,
  Metal_Wide = 11,
  Metal_Slim = 12,
  Metal_Rounded = 13,
  Pins = 14,
  Minimal_Black = 15,
  Minimal_White = 16,
  Tape = 17,
  Wood_Slim = 18,
  Wood_Wide = 19,
  Wood_Twigs = 20,
  Canvas = 21,
  None = 22
}

/** @public */
export type NFTShapeConstructorArgs = {
  color?: Color3
  style?: PictureFrameStyle
}

/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.NFT_SHAPE)
export type NFTShape = {
  readonly src: string
  readonly style: PictureFrameStyle
  color: Color3
}

/**
 * @public
 */
// @DisposableComponent('engine.texture', COMPONENT_ID.TEXTURE)
export type Texture = {
  readonly src: string
  readonly samplingMode: number
  readonly wrap: number
  readonly hasAlpha: boolean
}

/** @public */
export type AnimationParams = {
  looping?: boolean
  speed?: number
  weight?: number
  layer?: number
}

const defaultParams: Required<
  Pick<AnimationParams, 'looping' | 'speed' | 'weight' | 'layer'>
> = {
  looping: true,
  speed: 1.0,
  weight: 1.0,
  layer: 0
}

/**
 * @public
 */
export type AnimationState = {
  readonly clip: string
  looping: boolean
  weight: number
  playing: boolean
  shouldReset: boolean
  speed: number
  name: string
  layer: number
  owner?: Animator
}

/**
 * @public
 */
// @Component('engine.animator', COMPONENT_ID.ANIMATION)
export type Animator = {
  states: AnimationState[]
}

/**
 * @public
 */
// @DisposableComponent('engine.shape', COMPONENT_ID.OBJ_SHAPE)
export type OBJShape = {
  src: string
}

/**
 * @public
 */
// @DisposableComponent('engine.font', COMPONENT_ID.FONT)
export type Font = {
  src: string
}

/**
 * @public
 */
export enum Fonts {
  /** @deprecated SanFrancisco has been deprecated. Use SansSerif instead.*/
  SanFrancisco = 'builtin:SF-UI-Text-Regular SDF',
  /** @deprecated SanFrancisco_Heavy has been deprecated. Use SansSerif_Heavy instead.*/
  SanFrancisco_Heavy = 'builtin:SF-UI-Text-Heavy SDF',
  /** @deprecated SanFrancisco_Semibold has been deprecated. Use SansSerif_SemiBold instead.*/
  SanFrancisco_Semibold = 'builtin:SF-UI-Text-Semibold SDF',
  LiberationSans = 'builtin:LiberationSans SDF',
  SansSerif = 'SansSerif',
  SansSerif_Heavy = 'SansSerif_Heavy',
  SansSerif_Bold = 'SansSerif_Bold',
  SansSerif_SemiBold = 'SansSerif_SemiBold'
}

/**
 * @public
 */
// @Component('engine.text', COMPONENT_ID.TEXT_SHAPE)
export type TextShape = {
  outlineWidth: number
  outlineColor: Color3
  color: Color3
  fontSize: number

  font?: Font
  opacity: number
  value: string
  lineSpacing: string
  lineCount: number
  textWrapping: boolean
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
  shadowColor: Color3
  hTextAlign: string
  vTextAlign: string
  width: number
  height: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  billboard: boolean
  visible: boolean
}

/**
 * @public
 */
export enum TransparencyMode {
  OPAQUE = 0,
  ALPHA_TEST = 1,
  ALPHA_BLEND = 2,
  ALPHA_TEST_AND_BLEND = 3,
  AUTO = 4
}

/**
 * @public
 */
// @DisposableComponent('engine.material', COMPONENT_ID.PBR_MATERIAL)
export type Material = {
  /**
   * Cutoff level for ALPHATEST mode. Range is between 0 and 1.
   * Defaults to 0.5
   */

  alphaTest?: number

  /**
   * AKA Diffuse Color in other nomenclature.
   * Defaults to #CCCCCC.
   */

  albedoColor?: Color4 | Color3

  /**
   * The color emitted from the material.
   * Defaults to black.
   */

  emissiveColor?: Color3

  /**
   * Specifies the metallic scalar of the metallic/roughness workflow.
   * Can also be used to scale the metalness values of the metallic texture.
   * Defaults to  0.5.
   */

  metallic?: number

  /**
   * Specifies the roughness scalar of the metallic/roughness workflow.
   * Can also be used to scale the roughness values of the metallic texture.
   * Defaults to  0.5.
   */

  roughness?: number

  /**
   * AKA Specular Color in other nomenclature.
   * Defaults to white.
   */

  reflectivityColor?: Color3

  /**
   * Intensity of the direct lights e.g. the four lights available in scene.
   * This impacts both the direct diffuse and specular highlights.
   * Defaults to 1.
   */

  directIntensity?: number

  /**
   * AKA Glossiness in other nomenclature.
   * Defaults to 1.
   */

  microSurface?: number

  /**
   * Intensity of the emissive part of the material.
   * This helps controlling the emissive effect without modifying the emissive color.
   * Defaults to 1.
   */

  emissiveIntensity?: number

  /**
   * This is a special control allowing the reduction of the specular highlights coming from the
   * four lights of the scene. Those highlights may not be needed in full environment lighting.
   * Defaults to 1.
   */

  specularIntensity?: number

  /**
   * Texture applied as material.
   */
  albedoTexture?: Texture // | VideoTexture | AvatarTexture

  /**
   * Texture applied as opacity. Default: the same texture used in albedoTexture.
   */
  alphaTexture?: Texture // | VideoTexture | AvatarTexture

  /**
   * Emissive texture.
   */
  emissiveTexture?: Texture // | VideoTexture | AvatarTexture

  /**
   * Stores surface normal data used to displace a mesh in a texture.
   */
  bumpTexture?: Texture // | AvatarTexture

  /**
   * Allow the material to cast shadows over other objects
   */

  castShadows?: boolean

  /**
   * Sets the transparency mode of the material.
   * Defaults to -1.
   *
   * | Value | Type                                           |
   * | ----- | ---------------------------------------------- |
   * | 0     | OPAQUE  (default)                              |
   * | 1     | ALPHATEST                                      |
   * | 2     | ALPHABLEND                                     |
   * | 3     | ALPHATESTANDBLEND                              |
   * | 4     | AUTO (ALPHABLEND if alpha OPAQUE otherwise     |
   */

  transparencyMode: TransparencyMode
}

/**
 * @public
 */
// @DisposableComponent('engine.material', COMPONENT_ID.BASIC_MATERIAL)
export type BasicMaterial = {
  /**
   * The source of the texture image.
   */
  texture?: Texture // | VideoTexture | AvatarTexture

  /**
   * A number between 0 and 1.
   * Any pixel with an alpha lower than this value will be shown as transparent.
   */

  alphaTest: number

  /**
   * Allow the material to cast shadows over other objects
   */

  castShadows?: boolean
}
