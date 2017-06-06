import { AssertionError } from './AssertionError'

export function notOk(actual: boolean): boolean {
  if (!actual) return actual

  throw new AssertionError(`Value is truthy`, true, actual, notOk)
}
