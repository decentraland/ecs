const isProd = () => false

export function readonly<T extends Record<string, unknown>>(
  val: T
): Readonly<T> {
  // Fail only on development due to perf issues
  if (isProd()) {
    return val
  }
  return Object.freeze({ ...val })
}

export function isNotUndefined<T>(val: T | undefined): val is T {
  return !!val
}
