import * as expand from 'glob-expand'
import * as path from 'path'

import { flatten, map, range } from '167'
import { green, red } from 'typed-colors'

import { ParsedArgs } from './types'
import { TestResults } from '../results'
import { compile } from './compile'
import { findTests } from './findTests'

const cwd = process.cwd()

const TESTS_RUN_IN = `Tests run in`

export async function run(args: ParsedArgs, timeout: number) {
  if (args.requires) flatten([args.requires]).forEach(require)

  const testFiles = map(file => path.join(cwd, file), expand({ cwd, filter: 'isFile' }, args._))

  const compiledTestFiles = compile(testFiles)

  const tests = findTests(compiledTestFiles)

  console.time(TESTS_RUN_IN)
  const results = await Promise.all(tests.map(test => test.run(timeout)))

  const overallResults = new TestResults('', results)

  const { passed, failed } = overallResults.report()

  console.log()
  console.log(`  ` + overallResults.toString().trim())

  if (failed > 0 && passed > 0) {
    const separation = map(() => `-`, range(1, 36)).join('')

    console.log()
    console.error(`${separation}${red('Errors')}${separation}`)
    console.error()
    console.error(`  ` + overallResults.errors().trim())
  }

  console.log()
  console.log(`${green(String(passed))} Passing`)
  console.log(`${red(String(failed))} Failing`)

  console.timeEnd(TESTS_RUN_IN)

  if (failed > 0) process.exit(1)

  process.exit(0)
}
