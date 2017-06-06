import { Test } from '../types'

export function isTest(x: any): x is Test {
  return x && x.hasOwnProperty('name') && typeof x.run === 'function'
}
