import { AssertionError } from './AssertionError'
import { curry2 } from '167'

export const same: Same = curry2(function<A>(expected: A, actual: A): A {
  if (expected !== actual)
    throw new AssertionError(
      `Expected value is not strictly equal to actual value`,
      expected,
      actual,
      same
    )

  return actual
})

export interface Same {
  <A>(expected: A, actual: A): A
  <A>(expected: A): (actual: A) => A
}
