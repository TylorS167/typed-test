import { createAssertionError } from 'assertion-error-diff'

export function ok(actual: boolean): boolean {
  if (actual) return actual

  throw createAssertionError(`Value is not truthy`, true, actual)
}
