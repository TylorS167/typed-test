import { Arity1, curry2 } from '167'
import { Done, SingularTest } from './types'

import { createTestRun } from './internal'

export const it: It = curry2(_it)

export interface It {
  <A>(does: string, test: (done: Done) => A | Promise<A>): SingularTest
  <A>(does: string): (test: (done: Done) => A | Promise<A>) => SingularTest
}

function _it<A>(name: string, test: Arity1<Done, A | Promise<A>>): SingularTest {
  const run = createTestRun(test, name)

  return ({ '@@typed/test': 'it', name, run })
}
