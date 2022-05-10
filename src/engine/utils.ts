import { DeepReadonly } from './types'

const isProd = () => !!process.env.PRODUCTION || false

export function deepReadonly<T extends Record<string, unknown>>(
  val: T
): DeepReadonly<T> {
  // Fail only on development due to perf issues
  if (isProd()) {
    return val
  }

  return Object.freeze({ ...val })
}

export function isNotUndefined<T>(val: T | undefined): val is T {
  return !!val
}
