import { Test } from './types'
import { blue } from 'typed-colors'

export function given(something: string, ...tests: Array<Test>): Test {
  return ({ '@@typed/test': `${blue('given')} ${something}`, tests })
}
