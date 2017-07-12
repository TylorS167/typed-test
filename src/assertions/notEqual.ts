import { curry2, equals } from '167'

import { createAssertionError } from 'assertion-error-diff'

export const notEqual: NotEqual = curry2(function<A>(expected: A, actual: A): A {
  if (equals(expected, actual))
    throw createAssertionError(`Expected value is equal to actual value`, expected, actual)

  return actual
})

export interface NotEqual {
  <A>(expected: A, actual: A): A
  <A>(expected: A): (actual: A) => A
}
