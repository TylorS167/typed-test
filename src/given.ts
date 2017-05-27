import { Test } from './types'
import { blue } from 'typed-colors'

export function given(something: string, ...tests: Array<Test<any>>): Test<any> {
  return ({ '@@typed/test': `${blue('given')} ${something}`, tests })
}
