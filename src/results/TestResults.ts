import { TestResult } from './TestResult'

export class TestResults {
  public name: string
  public results: Array<TestResult | TestResults>

  constructor(name: string, results: Array<TestResult | TestResults>) {
    this.name = name
    this.results = results
  }

  public toString(): string {
    const prefix = `${this.name}\n`.trim()

    const str = this.results
      .map(result => result.toString())
      .filter(str => str.length > 0)
      .join('\n')

    return `\n` + padNewLine(prefix + str).trim()
  }

  public errors(): string {
    const errorString = this.results
      .map(result => result.errors())
      .filter(str => str.length > 0)
      .join(`\n`)

    if (errorString.length === 0) return ''

    const prefix = `${this.name}\n`.trim()

    return `\n` + padNewLine(prefix + errorString)
  }

  public report(): { passed: number; failed: number } {
    const { results } = this

    let passed = 0
    let failed = 0

    for (const result of results) {
      const report = result.report()

      passed += report.passed
      failed += report.failed
    }

    return { passed, failed }
  }
}

function padNewLine(str: string): string {
  return str.replace(/(\n)/g, `\n  `)
}
