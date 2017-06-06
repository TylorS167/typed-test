import { Assertions } from '../assertions'

export type Done = <Err extends Error>(error?: Err) => void

export type TestFn = (assertions: Assertions, done: Done) => any

export type TestResult = SuccessfulTestResult | FailedTestResult

export interface SuccessfulTestResult {
  passed: true
  error: void
}

export interface FailedTestResult {
  passed: false
  error: Error
}

export interface Test {
  name: string
  run(timeout: number): Promise<TestResult>
}
