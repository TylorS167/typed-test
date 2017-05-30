import { GroupTest, Result, SingularTest, Test } from './types'
import { Just, fromJust, join, map } from '167'
import { blue, bold, green, red, reset } from 'typed-colors'
import { chain, map as mapP, resolved } from '@typed/promises'
import { cross, tick } from 'typed-figures'

import { padNewLines } from './internal'

const good = (type: string, s: string) => `${green(tick)} ${blue(type)} ${reset(s)}`
const failed = (type: string, s: string) => `${red(cross)} ${blue(type)} ${reset(s)}`

function sequence<A>(tests: ReadonlyArray<Test>, f: (test: Test) => Promise<A>): Promise<Array<A>> {
  let promise = resolved<any>('')
  const results: Array<A> = []

  for (const test of tests) {
    promise = chain(
      () => f(test).then((result) => results.push(result)),
      promise,
    )
  }

  return mapP(() => results, promise)
}

export function displayResult(test: Test): Promise<string> {
  if (test.hasOwnProperty('tests')) {
    const { '@@typed/test': name, tests } = test as GroupTest

    const results =
      mapP<Array<string>, ReadonlyArray<string>>(map(padNewLines(2)),
        sequence(tests, displayResult))

    return mapP((strs) => `${blue(name)}` + `\n  ` + join('\n\n  ', strs), results)
  }

  const { '@@typed/test': name, run } = test as SingularTest

  return chain(resultToString(name), run())
}

function resultToString(testType: string) {
  return function(result: Result): Promise<string> {
    const { name, passed, error } = result

    if (passed) return resolved(good(testType, name))

    return resolved(failed(testType, formatError(name, fromJust<Error>(error as Just<Error>))))
  }
}

function formatError(name: string, error: Error) {
  const formattedError = `${name}` + `\n` +
    `  Error: ${error.message}` + `\n`

  if (error && error.hasOwnProperty('actual') && error.hasOwnProperty('expected')) {
    return formattedError + `  ${green(`+ expected`)} ${red('- actual')}` + `\n\n` +
      `  ${red(`- ${bold(cross)} ${(error as any).actual}`)}` + `\n` +
      `  ${green(`+ ${bold(cross)} ${(error as any).expected}`)}` + `\n`
  }

  return formattedError
}
