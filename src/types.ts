import { TestResult, TestResults } from './results'

import { Assertions } from '@typed/assertions'

export type Done = <Err extends Error>(error?: Err) => void

export type TestFn = (assertions: Assertions, done: Done) => any

export interface Test {
  only: boolean
  run(timeout: number): Promise<TestResult | TestResults>
}
