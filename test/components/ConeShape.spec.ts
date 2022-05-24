import { Engine } from '../../src/engine'
import { ConeShape } from '../../src/components/generated/ConeShape'

describe('Generated ConeShape ProtoBuf', () => {
  it('should serialize/deserialize BoxShape', () => {
    const newEngine = Engine()
    const { ConeShape } = newEngine.baseComponents
    const entity = newEngine.addEntity()
    const entityB = newEngine.addEntity()

    const _shape = ConeShape.create(entity, {
      isPointerBlocker: true,
      visible: true,
      withCollisions: true,
      radiusTop: 1,
      radiusBottom: 1
    })

    ConeShape.create(entityB, {
      isPointerBlocker: false,
      visible: false,
      withCollisions: false,
      radiusTop: 0,
      radiusBottom: 0
    })
    const buffer = ConeShape.toBinary(entity)
    ConeShape.updateFromBinary(entityB, buffer)

    expect(_shape).toBeDeepCloseTo({ ...ConeShape.mutable(entityB) })
  })
})
