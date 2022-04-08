/* eslint-disable prettier/prettier */
import { defineLegacyComponents } from './legacy'
import { CLASS_ID } from './types'
import { Sync } from './sync'
import type { Engine } from '../engine'
import { LEGACY_CLASS_ID } from './legacy/types'

export * from './types'

export function getComponentIds() {
  const componentIds: number[] = [LEGACY_CLASS_ID, CLASS_ID]
    .map(a => Object.values(a)
    .filter(a => typeof a === 'number'))
    .flat()

  return componentIds
}

export function defineSdkComponents(engine: Pick<Engine, 'defineComponent'>) {
  const { defineComponent } = engine
  return {
    ...defineLegacyComponents(engine),
    Sync: defineComponent(CLASS_ID.SYNC, Sync)
  }
}