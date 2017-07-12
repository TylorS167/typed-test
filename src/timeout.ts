import { Test } from './types'
import { TestResults } from './results'
import { describe } from './describe'

export function timeout(ms: number, tests: Array<Test>): Test {
  const test = describe('', tests)

  return {
    ...test,
    run() {
      return test.run(ms).then((results: TestResults) => {
        const str = results.toString().replace(/(\n\s\s)/g, '\n').trim()
        const error = results.errors().trim().replace(/(\n\s\s)/g, '\n').trim()

        return {
          toString() { return str },
          errors() { return error },
          report() { return results.report() }
        } as TestResults
      })
    }
  }
}
