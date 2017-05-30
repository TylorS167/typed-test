import { Test } from './types'
import { blue } from 'typed-colors'
import { flatten } from '167'

export function describe(
  what: string,
  ...tests: Array<Test | Array<Test>>): Test
{
  return ({ '@@typed/test': `\n${blue('describe')} ${what}`, tests: flatten<Test>(tests) })
}
