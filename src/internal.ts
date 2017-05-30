import { Arity1, just, nothing } from '167'
import { Done, GroupTest, Result, SingularTest, Test } from './types'
import { create, rejected, resolved } from '@typed/promises'

export function padNewLines(amount: number) {
  return function(str: string): string {
    let padding = ''

    for (let i = 0; i < amount; ++i)
      padding += ' '

    return str.replace(/(\n)/g, '\n' + padding)
  }
}

export const isTest = (x: any): x is Test => !!x['@@typed/test']

export const isSingularTest = (x: Test): x is SingularTest =>
  typeof (x as SingularTest).run === 'function'

export const isGroupTest = (x: Test): x is GroupTest => Array.isArray((x as GroupTest).tests)

export function createTestRun<A>(test: Arity1<Done, A | Promise<A>>, name: string) {
  return function() {
    return create<Result>(({ resolve }) => {
      const done: Done = (error?: Error) => !!error ?
        resolve({ name, passed: false, error: just(error) }) :
        resolve({ name, passed: true, error: nothing() })

      runTest(test, done)
        .then(() => { if (test.length === 0) done() }, done)
    })
  }
}

function runTest<A>(test: Arity1<Done, A | Promise<A>>, done: Done): Promise<A> {
  try {
    return resolved(test(done))
  } catch (e) {
    return rejected(e)
  }
}
