import { SandBox } from './utils'

describe('Performance.', () => {
  it('should run 10k iterations', () => {
    const { engine, components } = SandBox.create({ length: 1 })[0]
    const { Transform } = engine.baseComponents
    performance.mark('create-entities')
    for (const _ of Array.from({ length: 1000 })) {
      const entity = engine.addEntity()

      Transform.create(entity, SandBox.DEFAULT_POSITION)

      if (Math.random() > 0.5) {
        components.Position.create(entity, {
          x: Math.random() * 10 + 1,
          y: Math.random() * 24 + 1
        })
      }

      if (Math.random() < 0.5) {
        components.Door.create(entity, { open: (Math.random() * 10) | 0 })
      }
    }
    performance.mark('end-create-entities')

    const EntitiesCreation = performance.measure(
      'Entities creation',
      'create-entities',
      'end-create-entities'
    )

    function doorSystem() {
      for (const [_entity, door] of engine.mutableGroupOf(components.Door)) {
        door.open = Math.random() * 10
      }
    }

    function transformSystem() {
      for (const [_entity, position, transform] of engine.mutableGroupOf(
        components.Position,
        Transform
      )) {
        transform.position.x = position.x + Math.random() * 10
        position.y = transform.position.y + Math.random() * 10
      }
    }

    engine.addSystem(doorSystem)
    engine.addSystem(transformSystem)

    performance.mark('update')
    for (const _ of Array.from({ length: 1000 })) {
      engine.update(1)
    }
    performance.mark('end-update')

    const EngineUpdate = performance.measure(
      'Engine Updates',
      'update',
      'end-update'
    )

    console.log(EntitiesCreation)
    console.log(EngineUpdate)
    expect(EntitiesCreation.duration).toBeLessThan(30)
    expect(EngineUpdate.duration).toBeLessThan(31000)
  })
})
