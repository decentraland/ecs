import { defineLegacyComponents } from './legacy'
import type { Engine } from '../engine/types'

export * from './types'

export function defineSdkComponents(engine: Pick<Engine, 'defineComponent'>) {
  return {
    ...defineLegacyComponents(engine)
  }
}
