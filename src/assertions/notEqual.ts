import { curry2, equals } from '167'

import { AssertionError } from './AssertionError'

export const notEqual: NotEqual = curry2(function<A>(expected: A, actual: A): A {
  if (equals(expected, actual))
    throw new AssertionError(`Expected value is equal to actual value`, expected, actual, notEqual)

  return actual
})

export interface NotEqual {
  <A>(expected: A, actual: A): A
  <A>(expected: A): (actual: A) => A
}
