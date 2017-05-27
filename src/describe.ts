import { Test } from './types'
import { blue } from 'typed-colors'

export function describe(what: string, ...tests: Array<Test>): Test {
  return ({ '@@typed/test': `${blue('describe')} ${what}`, tests })
}
