import { Test, TestCollection } from '../types'

import { curry2 } from '167'
import { isTestCollection } from './isTestCollection'

export const timeout: TimeoutArity2 = curry2(function(time: number, test: any): any {
  function run() {
    return test.run(time)
  }

  return isTestCollection(test)
    ? { name: test.name, tests: test.tests, run }
    : { name: test.name, run }
})

export interface TimeoutArity2 {
  (time: number, test: Test): Test
  (time: number, test: TestCollection): TestCollection

  (time: number): TimeoutArity1
}

export interface TimeoutArity1 {
  (test: Test): Test
  (test: TestCollection): TestCollection
}
