import { Test } from './types'
import { TestResults } from './results'
import { blue } from 'typed-colors'

/**
 * Allows creating a descriptive suite of tests from many other tests
 * 
 * To run only a single collection use `given.only()`
 * 
 * @name given(what: string, tests: Array<Test>): Test
 * @example
 * import { Test, describe, given it } from '@typed/test'
 * 
 * export const test: Test = describe('foo', [
 *   given('bar', [
 *     it('returns bar', ({ ok }) => {
 *       ok(foo('bar') === 'bar')
 *     })
 *   ])
 * ])
 */
export function given(what: string, tests: Array<Test>): Test {
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

export namespace given {
  export function only(what: string, tests: Array<Test>): Test {
    return { ...given(what, tests), only: true }
  }
}

function run(what: string, tests: Array<Test>, timeout: number): Promise<TestResults> {
  const name = `${blue('given')} ${what}`

  return Promise.all(tests.map(test => test.run(timeout))).then(
    results => new TestResults(name, results)
  )
}
