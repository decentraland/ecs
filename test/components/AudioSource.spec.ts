import { Engine } from '../../src/engine'

describe('Generated PlaneShape ProtoBuf', () => {
  it('should serialize/deserialize BoxShape', () => {
    const newEngine = Engine()
    const { AudioSource } = newEngine.baseComponents
    const entity = newEngine.addEntity()
    const entityB = newEngine.addEntity()

    const _sphereShape = AudioSource.create(entity, {
      playing: true,
      loop: true,
      volume: 1,
      pitch: 1,
      playedAtTimestamp: 1,
      audioClipUrl: 'FakeUrl'
    })

    AudioSource.create(entityB, {
      playing: false,
      loop: false,
      volume: 0,
      pitch: 0,
      playedAtTimestamp: 0,
      audioClipUrl: 'FakeUrl2'
    })
    const buffer = AudioSource.toBinary(entity)
    AudioSource.updateFromBinary(entityB, buffer)

    expect(_sphereShape).toBeDeepCloseTo({ ...AudioSource.mutable(entityB) })
  })
})
