/* eslint-disable prettier/prettier */
import { defineLegacyComponents } from './legacy'
import { CLASS_ID } from './types'
import { Sync } from './sync'
import type { Engine } from '../engine'

export function defineSdkComponents(engine: Engine) {
  const { defineComponent } = engine
  return {
    ...defineLegacyComponents(engine),
    Sync: defineComponent(CLASS_ID.SYNC, Sync)
  }
}