import { Arity1, curry2, just, nothing } from '167'
import { Done, Result, SingularTest } from './types'
import { bimap, create, rejected, resolved } from '@typed/promises'

export const it: It = curry2(_it)

export interface It {
  <A>(does: string, test: (done: Done) => A | Promise<A>): SingularTest
  <A>(does: string): (test: (done: Done) => A | Promise<A>) => SingularTest
}

function _it<A>(name: string, test: Arity1<Done, A | Promise<A>>): SingularTest {
  const run = () => create<Result>(({ resolve }) => {
    const done: Done = (error?: Error) => !!error ?
      resolve({ name, passed: false, error: just(error) }) :
      resolve({ name, passed: true, error: nothing() })

    bimap(done, () => done(), runTest(test, done))
  })

  return ({ '@@typed/test': 'it', run })
}

function runTest<A>(test: Arity1<Done, A | Promise<A>>, done: Done): Promise<A> {
  try {
    return resolved(test(done))
  } catch (e) {
    return rejected(e)
  }
}
