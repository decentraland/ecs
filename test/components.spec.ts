import { Engine } from "../src/engine"
import { defineLegacyComponents } from '../src/legacy-components'
import { Quaternion, Vector3 } from "@dcl/ecs-math"

describe("Legacy component tests", () => {
  it("cube example scene", () => {
    // Should be expose from library?
    const newEngine = Engine()
    const sdk = defineLegacyComponents(newEngine)

    // Scene part
    const spawnCube = (x: number, y: number, z: number) => {
      const newCubeEntity = newEngine.addEntity()

      sdk.BoxShape.create(newCubeEntity, {
        isPointerBlocker: true,
        visible: true,
        withCollisions: true,
        uvs: []
      })

      sdk.Transform.create(newCubeEntity, {
        position: new Vector3(x, y, z),
        scale: Vector3.One(),
        rotation: Quaternion.Identity
      })

      return newCubeEntity
    }

    function RotatorSystem(dt: number) {
      const group = newEngine.mutableGroupOf(sdk.Transform)
      for (const [entity, component] of group) {
        component.rotation = component.rotation.multiplyInPlace(this.rotation.angleAxis(dt * 10, Vector3.Up()))
      }
    }

    const baseCube = spawnCube(4, 2, 4)
    newEngine.addSystem(RotatorSystem)
  })


})
