import { AssertionError } from './AssertionError'

export function ok(actual: boolean): boolean {
  if (actual) return actual

  throw new AssertionError(`Value is not truthy`, true, actual, ok)
}
