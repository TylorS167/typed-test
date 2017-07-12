import { Done, Test, TestFn } from './types'

import { TestResult } from './results'
import { blue } from 'typed-colors'
import { createAssertionsEnvironment } from '@typed/assertions'

/**
 * Allows creating a Test that makes `n` number of assertions. Uses 
 * assertion counting on the assertions provided as the first parameter to 
 * the test function. Test will fail if 0 assertions are made. An optional 
 * `done` callback is passed in as the second parameter to the test function 
 * that can be used to signal completion of a async test. 
 * 
 * Supports returning a Promise to signal completion of the test.
 * 
 * To run only this one test use `it.only()`
 * 
 * @name it(does: string, test: TestFn): Test 
 * @example
 * import { it } from '@typed/test'
 * 
 * export const testOne = it('returns true', ({ ok }) => {
 *   ok(foo())
 * })
 */
export function it(does: string, test: TestFn): Test {
  return {
    only: false,
    run(timeout: number) {
      return run(does, test, timeout)
    },
  }
}

export namespace it {
  export function only(does: string, test: TestFn) {
    return {
      only: true,
      run(timeout: number) {
        return run(does, test, timeout)
      },
    }
  }
}

function run(does: string, test: TestFn, timeout: number): Promise<TestResult> {
  const { stats, assertions } = createAssertionsEnvironment()

  const name = `${blue('it')} ${does}`

  let id: NodeJS.Timer

  return new Promise<TestResult>(resolve => {
    const done: Done = (error?: Error) => {
      if (id) clearTimeout(id)

      return stats.count === 0
        ? resolve(new TestResult(name, new Error('No assertions used')))
        : resolve(new TestResult(name, error))
    }

    if (test.length === 0) return done()

    try {
      const x = test(assertions, done)

      id = setTimeout(() => done(new Error(`Timed out after ${timeout} ms`)), timeout)

      const isPromise = x && typeof (x as Promise<any>).then === 'function'

      if (!isPromise && test.length === 1) done()

      if (isPromise && test.length === 2)
        return done(new Error('Cannot use done callback and return Promise'))

      if (isPromise) return x.then(() => done()).catch(done)
    } catch (e) {
      done(e)
    }
  })
}
