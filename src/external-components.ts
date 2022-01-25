import { Engine } from './engine'

export type Position = {
  x: number
}
const position = {
  componentId: 44,
  serialize: () => {}
}
type Engine = ReturnType<typeof Engine>

export function addComponentsToEngine(engine: Engine) {
  const Position = engine.defineComponent<Position>(position.componentId)

  return {
    Position
  }
}

