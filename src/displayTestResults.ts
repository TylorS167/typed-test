import { AssertionError, createDiff } from './assertions'
import { TestResult, TestResults } from './types'
import { cross, tick } from 'typed-figures'
import { green, red } from 'typed-colors'

import { flatten } from '167'
import { isTestResult } from './tests'

export function displayTestResults(name: string, testResults: TestResults): string {
  const { results } = testResults

  let str = name + `\n`

  for (const key in results) {
    const result = flatten<TestResult | TestResults>([results[key]])

    result.forEach(nestedResult => {
      str += displayResult(key, nestedResult)
    })
  }

  return `\n` + padNewLine(str).trim()
}

function displayResult(name: string, result: TestResult | TestResults): string {
  return isTestResult(result)
    ? displayTestResult(name, result) + `\n`
    : displayTestResults(name, result) + `\n`
}

export function displayTestResult(name: string, result: TestResult): string {
  const { error } = result

  const str = !error
    ? `${green(tick)} ${name}`
    : `\n${red(cross)} ${name} \n` +
        padNewLine(`  ${isAssertionError(error) ? createDiff(error) : error.stack}`)

  return str
}

function isAssertionError(error: Error): error is AssertionError<any> {
  return error && error.hasOwnProperty('actual') && error.hasOwnProperty('expected')
}

function padNewLine(str: string): string {
  return str.replace(/\n/gi, `\n  `)
}
