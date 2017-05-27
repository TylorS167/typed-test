import { Test } from './types'
import { blue } from 'typed-colors'

export function describe(what: string, ...tests: Array<Test<any>>): Test<any> {
  return ({ '@@typed/test': `${blue('describe')} ${what}`, tests })
}
