import { Test } from './types'
import { blue } from 'typed-colors'
import { flatten } from '167'

export function given(
  something: string,
  ...tests: Array<Test | Array<Test>>): Test
{
  return ({ '@@typed/test': `\n${blue('given')} ${something}`, tests: flatten<Test>(tests) })
}
