import { TestResults } from '../types'

export function isTestResults(x: any): x is TestResults {
  return x && x.hasOwnProperty('passed') && x.hasOwnProperty('results')
}
