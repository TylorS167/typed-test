import * as expand from 'glob-expand'
import * as path from 'path'

import { flatten, map } from '167'

import { ParsedArgs } from '../types'
import { TestResults } from '../../results'
import { compile } from './compile'
import { findTests } from './findTests'
import { logResult } from '../logResult'

const cwd = process.cwd()

const TESTS_RUN_IN = `Tests run in`

export async function run(args: ParsedArgs, timeout: number) {
  if (args.requires) flatten([args.requires]).forEach(require)

  const testFiles = map(file => path.join(cwd, file), expand({ cwd, filter: 'isFile' }, args._))

  const compiledTestFiles = compile(testFiles)

  const tests = findTests(compiledTestFiles)

  console.time(TESTS_RUN_IN)
  const results = await Promise.all(tests.map(test => test.run(timeout)))
  console.timeEnd(TESTS_RUN_IN)

  const overallResults = new TestResults('', results)

  process.exit(logResult(overallResults))
}
