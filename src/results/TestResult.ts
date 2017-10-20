import { cross, tick } from 'typed-figures'
import { green, red } from 'typed-colors'

import { Result } from '../types'
import { errorToString } from 'assertion-error-diff'

export class TestResult implements Result {
  public name: string
  public passed: boolean
  public error: Error | null

  constructor(name: string, error: Error | null) {
    this.name = name
    this.error = error
    this.passed = !error
  }

  public toString(): string {
    return this.passed
      ? `\n${green(tick)} ${this.name}`
      : `\n${red(cross)} ${this.name}\n  ${errorToString(this.error)}`
  }

  public errors(): string {
    return this.passed ? '' : this.toString()
  }

  public report(): { passed: number; failed: number } {
    const { passed } = this

    return {
      passed: passed ? 1 : 0,
      failed: passed ? 0 : 1,
    }
  }
}
