import { Assertions, createAssertionsEnvironment } from '../assertions'
import { Test, TestFn, TestResult } from './types'

export function it(does: string, test: TestFn): Test {
  return new It(does, test)
}

class It implements Test {
  public name: string
  protected test: TestFn

  constructor(name: string, test: TestFn) {
    this.name = name
    this.test = test
  }

  run(timeout: number = 2000): Promise<TestResult> {
    const { test } = this
    const { assertions, stats } = createAssertionsEnvironment()

    return failAfterGivenTimeout(timeout, runTest(test, assertions))
      .then((): TestResult => {
        if (stats.count === 0) throw new Error(`No assertions have been made`)

        return { passed: true, error: void 0 }
      })
      .catch((error): TestResult => ({ passed: false, error }))
  }
}

function runTest(test: TestFn, assertions: Assertions): Promise<any> {
  switch (test.length) {
    // not using assertions passed in -- always fail
    case 0:
      return Promise.reject(new Error(`No assertions have been made`))
    // synchronous test or returning promise -- promise will reject if test throws
    case 1:
      return new Promise(resolve => resolve(test(assertions, Function.prototype as any)))
    // is using done() callback to signal test completion
    default: {
      return new Promise((resolve, reject) => {
        try {
          const result = test(assertions, (error?: Error) => {
            // use promise to ensure test returns first
            new Promise(res => setTimeout(res, 0, error)).then((err?: Error) => {
              if (err) return reject(err)

              resolve()
            })
          })

          if (result && typeof result.then === 'function')
            reject(new Error(`A promise-returning test should not use 'done' callback`))
        } catch (err) {
          reject(err)
        }
      })
    }
  }
}

function failAfterGivenTimeout(time: number, promise: Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Timed out after ${time} ms`))
      clearTimeout(id)
    }, time)

    promise.then((value: any) => {
      clearTimeout(id)
      resolve(value)
    }, reject)
  })
}
