import { createAssertionError } from 'assertion-error-diff'

export function notOk(actual: boolean): boolean {
  if (!actual) return actual

  throw createAssertionError(`Value is truthy`, true, actual)
}
