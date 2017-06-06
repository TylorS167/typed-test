import { TestCollection } from '../types'
import { isTest } from './isTest'

export function isTestCollection(x: any): x is TestCollection {
  return isTest(x) && x.hasOwnProperty(`tests`)
}
