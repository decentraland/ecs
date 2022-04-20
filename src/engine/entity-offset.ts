export namespace EntityOffset {
  export const MAX = 10000
  let offset: number = MAX

  export function getOffset() {
    const off = offset
    offset += MAX
    return off
  }
}

export default EntityOffset
