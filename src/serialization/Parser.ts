import { createDataViewExtended, DataViewExtended } from './DataViewExtended'

export type Parser = {
  dataView: DataViewExtended
}

export function createParser(dataArray: Uint8Array): Parser {
  const dataView = createDataViewExtended({ buffer: dataArray })
  return {
    dataView
  }
}
