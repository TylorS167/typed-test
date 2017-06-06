import { Results, Test, TestCollection, TestResult, TestResults } from '../types'
import { curry2, set } from '167'

import { blue } from 'typed-colors'
import { isTestCollection } from './isTestCollection'

export const describe: DescribeFn = curry2(function(
  what: string,
  tests: ReadonlyArray<Test | TestCollection>
) {
  return new Describe(what, tests)
})

export interface DescribeFn {
  (what: string, tests: Array<Test | TestCollection>): TestCollection
  (what: string): (tests: Array<Test | TestCollection>) => TestCollection
}

export class Describe implements TestCollection {
  public name: string
  public tests: ReadonlyArray<Test | TestCollection>

  constructor(name: string, tests: ReadonlyArray<Test | TestCollection>) {
    this.name = `${blue('Describe')} ${name}`
    this.tests = tests
  }

  run(timeout: number): Promise<TestResults> {
    const { tests } = this

    let promise = Promise.resolve({} as Results)
    let stats = { passed: true }

    for (let i = 0; i < tests.length; ++i)
      promise = promise.then(results => {
        const test = tests[i]

        return isTestCollection(test)
          ? runTestCollection(timeout, test, results, stats)
          : runTest(timeout, test, results, stats)
      })

    return promise.then(results => ({ passed: stats.passed, results }))
  }
}

function runTest(
  timeout: number,
  test: Test,
  results: Results,
  stats: { passed: boolean }
): Promise<Results> {
  return test.run(timeout).then(result => {
    if (!result.passed) stats.passed = false

    const previousResult = results[test.name]

    if (previousResult) return set(test.name, [previousResult, result] as any, results)

    return set(test.name, result, results)
  })
}

function runTestCollection(
  timeout: number,
  testCollection: TestCollection,
  results: Results,
  stats: { passed: boolean }
): Promise<Record<string, TestResult | TestResults>> {
  return testCollection.run(timeout).then(testResults => {
    if (!testResults.passed) stats.passed = false

    const previousResult = results[testCollection.name]

    if (previousResult)
      return set(testCollection.name, [previousResult, testResults] as any, results)

    return set(testCollection.name, testResults, results)
  })
}
