import { Test, TestCollection } from '../types'

import { Describe } from './describe'
import { blue } from 'typed-colors'
import { curry2 } from '167'

export const given: GivenFn = curry2(function(
  what: string,
  tests: ReadonlyArray<Test | TestCollection>
) {
  const test = new Describe(what, tests)

  const name = `${blue('given')} ${what}`

  return { name, tests: test.tests, run: (timeout: number) => test.run(timeout) }
})

export interface GivenFn {
  (what: string, tests: Array<Test | TestCollection>): TestCollection
  (what: string): (tests: Array<Test | TestCollection>) => TestCollection
}
