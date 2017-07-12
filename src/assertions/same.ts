import { curry2 } from '167'

export const same: Same = curry2(function<A>(expected: A, actual: A): A {
  if (expected !== actual) throw new Error(`Expected value is not strictly equal to actual value`)

  return actual
})

export interface Same {
  <A>(expected: A, actual: A): A
  <A>(expected: A): (actual: A) => A
}
