import { Result, Results } from '../types'

import { TestResults } from '../results'
import { compile } from '../cli/node/compile'
import { findTests } from '../cli/node/findTests'

export async function runNodeTests(testFiles: Array<string>, timeout: number): Promise<Result> {
  const results: Results = await Promise.all(
    findTests(compile(testFiles)).map(test => test.run(timeout))
  )

  return new TestResults('', results)
}
