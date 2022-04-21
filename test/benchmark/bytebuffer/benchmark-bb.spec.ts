import { measureTime } from '../utils'
import { createByteBuffer as createByteBufferV1 } from './v1/ByteBuffer'
import { createByteBuffer as createByteBufferV2 } from './v2/ByteBuffer'
import { ByteBuffer as ByteBufferV2 } from './v2/ByteBuffer'

describe('bytebuffer test ', () => {
  it('v1 vs v2', () => {
    const N = 100000
    const needCapacity = N * 4 + 100

    const t_v1 = measureTime(() => {
      const bb_v1 = createByteBufferV1({ initialCapacity: needCapacity })

      for (let i = 0; i < N; i++) {
        bb_v1.writeFloat32(Math.PI)
      }
    })

    const t_v2 = measureTime(() => {
      const bb_v2 = createByteBufferV2({ initialCapacity: needCapacity })

      for (let i = 0; i < N; i++) {
        ByteBufferV2.writeFloat32(bb_v2, Math.PI)
      }
    })

    const t_max = Math.max(t_v1, t_v2)
    const t_min = Math.min(t_v1, t_v2)

    console.log(`
    ByteBuffer writing ${N} float 32bit (single-precision):
      V1 => ${t_v1}ms
      V2 => ${t_v2}ms
      ${t_v1 < t_v2 ? 'V1' : 'V2'} is faster by ${t_max / t_min}X
    `)
  })
})
