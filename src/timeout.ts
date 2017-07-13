import { Test } from './types'
import { TestResults } from './results'
import { describe } from './describe'

/**
 * Given a duration in milliseconds and an array of tests it
 * will modify the tests to fail automatically after the given duration
 * has passed and the test has not completed.
 * 
 * @name timeout(ms: number, tests: Array<Test>): Test
 * @example
 * import { timeout, describe, it } from '@typed/test
 * 
 * export const wrapTestSuites = timeout(100, [
 *   describe(`Foo`, [ ... ])
 * ])
 * 
 * export const wrapSingleTests = timeout(10, [
 *   it(`does stuff`, ({ ok }) => { ... })
 * ])
 */
export function timeout(ms: number, tests: Array<Test>): Test {
  const test = describe('', tests)

  return {
    ...test,
    run() {
      return test.run(ms).then((results: TestResults) => {
        const str = results.toString().replace(/(\n\s\s)/g, '\n').trim()
        const error = results.errors().trim().replace(/(\n\s\s)/g, '\n').trim()

        return {
          toString() {
            return str
          },
          errors() {
            return error
          },
          report() {
            return results.report()
          },
        } as TestResults
      })
    },
  }
}
