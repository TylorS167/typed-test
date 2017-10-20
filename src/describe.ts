import { Result, Test } from './types'

import { TestResults } from './results'
import { blue } from 'typed-colors'

/**
 * Allows creating a suite of tests from many other tests
 * 
 * To run only this collection of tests use `describe.only()`
 * 
 * @name describe(what: string, tests: Array<Test>): Test
 * @example
 * import { Test, describe, it } from '@typed/test'
 * 
 * export const test: Test = describe('foo', [
 *   it('returns bar', ({ ok }) => {
 *     ok(foo() === 'bar')
 *   })
 * ])
 */
export function describe(what: string, tests: Array<Test>): Test {
  const onlyTests = tests.filter(test => test.only)

  const only = onlyTests.length > 0

  const testsToRun = only ? onlyTests : tests

  return {
    only,
    run(timeout: number) {
      return run(what, testsToRun, timeout)
    },
  }
}

export namespace describe {
  export function only(what: string, tests: Array<Test>): Test {
    return { ...describe(what, tests), only: true }
  }
}

function run(what: string, tests: Array<Test>, timeout: number): Promise<Result> {
  return Promise.all(tests.map(test => test.run(timeout))).then(
    results => new TestResults(blue(what), results)
  )
}
