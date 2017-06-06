import { TestResult } from '../types'

export function isTestResult(x: any): x is TestResult {
  return x && x.hasOwnProperty('passed') && x.hasOwnProperty('error')
}
