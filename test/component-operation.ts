import { Quaternion, Vector3 } from '@dcl/ecs-math'
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to'
import { Engine } from '../src/engine'
import {
  MessageType,
  writeComponentOperation,
  writePutComponentOperation
} from '../src/serialization/crdt/ComponentOperation'
expect.extend({ toBeDeepCloseTo, toMatchCloseTo })

describe('Component operation tests', () => {
  it('serialization one wiremessage', () => {
    const newEngine = Engine()
    const sdk = newEngine.baseComponents
    const entity = newEngine.addEntity()

    const mutableTransform = sdk.Transform.create(entity, {
      position: Vector3.create(1, 1, 1),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(1, 1, 1, 1)
    })

    const data = writePutComponentOperation({
      entityId: entity,
      componentClassId: sdk.Transform._id,
      timestamp: 20,
      data: sdk.Transform.toBinary(entity)
    })

    mutableTransform.position.x = 31.3

    const data2 = writePutComponentOperation(
      {
        componentClassId: sdk.Transform._id,
        timestamp: 20,
        entityId: entity,
        data: sdk.Transform.toBinary(entity)
      },
      data
    ).toBinary()

    console.log({ data2 })
  })
})
