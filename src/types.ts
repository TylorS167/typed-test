import { Assertions } from '@typed/assertions'

export type Done = <Err extends Error>(error?: Err) => void

export type TestFn = (assertions: Assertions, done: Done) => any

export interface Test {
  only: boolean
  run(timeout: number): Promise<Result>
}

export type Results = Array<Result>

export interface Result {
  toString(): string
  errors(): string
  report(): { passed: number; failed: number }
}
