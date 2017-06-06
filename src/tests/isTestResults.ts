import { TestResults } from '../types'

export function isTestResults(x: any): x is TestResults {
  return x && x.hasOwnProperty('name') && x.hasOwnProperty('results')
}
