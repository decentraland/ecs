import { Engine } from "../src/engine"
import { defineLegacyComponents } from '../src/legacy-components'
import { Quaternion, Vector3 } from "@dcl/ecs-math/dist/next"
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe("Legacy component tests", () => {
  it("cube example scene", () => {
    // Should be expose from library?
    const newEngine = Engine()
    const sdk = defineLegacyComponents(newEngine)

    // Scene part
    const spawnCube = (x: number, y: number, z: number) => {
      const newCubeEntity = newEngine.addEntity()

      const boxShape = sdk.BoxShape.create(newCubeEntity, {
        isPointerBlocker: true,
        visible: true,
        withCollisions: true,
        uvs: [0, 0, 0, 0]
      })

      const transform = sdk.Transform.create(newCubeEntity, {
        position: Vector3.create(x, y, z),
        scale: Vector3.One(),
        rotation: Quaternion.Identity()
      })

      return newCubeEntity
    }

    function RotatorSystem(dt: number) {
      const group = newEngine.mutableGroupOf(sdk.Transform)
      for (const [entity, component] of group) {
        Quaternion.multiplyToRef(
          component.rotation,
          Quaternion.angleAxis(dt * 10, Vector3.Up()),
          component.rotation
        )

        const transformData = sdk.Transform.toBinary(entity)
        const transformOriginal = { ...component }
        const transformReceveid = sdk.Transform.updateFromBinary(entity, transformData)
        expect(transformReceveid).toBeDeepCloseTo(transformOriginal)
      }

      const groupBoxShape = newEngine.mutableGroupOf(sdk.BoxShape)
      for (const [entity, component] of groupBoxShape) {
        const boxShapeData = sdk.BoxShape.toBinary(entity)
        const boxShapeOriginal = { ...component }
        const boxShapeReceveid = sdk.BoxShape.updateFromBinary(entity, boxShapeData)
        expect(boxShapeReceveid).toBeDeepCloseTo(boxShapeOriginal)
      }
    }

    const baseCube = spawnCube(4, 2, 4)
    newEngine.addSystem(RotatorSystem)

    newEngine.update(1 / 60)
  })


})
