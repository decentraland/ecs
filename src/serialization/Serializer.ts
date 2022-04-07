import { createDataViewExtended, DataViewExtended } from './DataViewExtended'

export type Serializer = {
  dataView: DataViewExtended
  push: (fn: () => void) => void
  getData: () => Uint8Array
}

export function createSerializer(): Serializer {
  const dataView = createDataViewExtended({ initialCapacity: 2048 })
  const fnQueue: (() => void)[] = []

  return {
    dataView,
    push(fn: () => void): void {
      fnQueue.push(fn)
    },
    getData(): Uint8Array {
      for (const fn of fnQueue) {
        fn()
      }
      return dataView.binary()
    }
  }
}
