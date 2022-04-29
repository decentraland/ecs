/* eslint-disable prettier/prettier */
import { defineLegacyComponents } from './legacy'
import { COMPONENT_ID } from './types'
import { Sync } from './sync'
import type { Engine } from '../engine'

export * from './types'

export function defineSdkComponents(engine: Pick<Engine, 'defineComponent'>) {
  const { defineComponent } = engine
  return {
    ...defineLegacyComponents(engine),
    Sync: defineComponent(COMPONENT_ID.SYNC, Sync)
  }
}