export function readonly<T extends Object>(val: T): Readonly<T> {
  return Object.freeze({ ...val })
}
