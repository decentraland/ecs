/* eslint-disable prettier/prettier */
import { defineLegacyComponents } from './legacy'
import { CLASS_ID } from './types'
import { Sync } from './sync'
import type { Engine } from '../engine'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const a: Pick<Engine, 'defineComponent'> = {}  as any as Pick<Engine, 'defineComponent'>


export function defineSdkComponents(engine: Pick<Engine, 'defineComponent'>) {
  const { defineComponent } = engine
  return {
    ...defineLegacyComponents(engine),
    Sync: defineComponent(CLASS_ID.SYNC, Sync)
  }
}