import { curry2, equals } from '167'

import { createAssertionError } from 'assertion-error-diff'

export const equal: Equal = curry2(function<A>(expected: A, actual: A): A {
  if (!equals(expected, actual))
    throw createAssertionError(`Expected value is not equal to actual value`, expected, actual)

  return actual
})

export interface Equal {
  <A>(expected: A, actual: A): A
  <A>(expected: A): (actual: A) => A
}
