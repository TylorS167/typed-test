import { equal } from './assertions/equal'
import { notEqual } from './assertions/notEqual'
import { notOk } from './assertions/notOk'
import { ok } from './assertions/ok'
import { rejects } from './assertions/rejects'
import { same } from './assertions/same'
import { throws } from './assertions/throws'

export type Done = <Err extends Error>(error?: Err) => void

export type TestFn = (assertions: Assertions, done: Done) => any

export type TestResult = SuccessfulTestResult | FailedTestResult

export interface SuccessfulTestResult {
  readonly passed: true
  readonly error: void
}

export interface FailedTestResult {
  readonly passed: false
  readonly error: Error
}

export interface Test {
  readonly name: string
  readonly run: (timeout: number) => Promise<TestResult>
}

export interface TestCollection {
  readonly name: string
  readonly tests: ReadonlyArray<Test | TestCollection>
  readonly run: (timeout: number) => Promise<TestResults>
}

export interface TestResults {
  readonly passed: boolean
  readonly results: Results
}

export type Results = Record<
  string,
  TestResult | TestResults | ReadonlyArray<TestResult | TestResults>
>

export interface Assertions {
  readonly equal: typeof equal
  readonly notEqual: typeof notEqual
  readonly notOk: typeof notOk
  readonly ok: typeof ok
  readonly rejects: typeof rejects
  readonly same: typeof same
  readonly throws: typeof throws
}

export interface Stats {
  count: number
}

export interface AssertionEnvironment {
  stats: Stats
  assertions: Assertions
}
