import { curry2, equals } from '167'

import { AssertionError } from './AssertionError'

export const equal: Equal = curry2(function<A>(expected: A, actual: A): A {
  if (!equals(expected, actual))
    throw new AssertionError(`Expected value is not equal to actual value`, expected, actual, equal)

  return actual
})

export interface Equal {
  <A>(expected: A, actual: A): A
  <A>(expected: A): (actual: A) => A
}
