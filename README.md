# @typed/test

> A simple test runner

## Get it
```sh
npm install --save-dev @typed/test
# or
yarn add --dev @typed/test
```

## Basic usage

```typescript
// foo.test.ts
import { describe, given, it } from '@typed/test'

function foo(str: string): string {
  return str.replace(/r/g, 'z')
}

// name of export is not important
// only requires a test to be exported
export const fooTest = describe(`foo`, [
  given(`'bar'`, [
    it(`returns 'baz'`, ({ equal }) => {
      equal('baz', foo('bar'))
    })
  ])
])

function bar(): string {
  return 'bar'
}

export const barTest = it(`returns 'bar'`, ({ ok }) => {
  ok(bar() === 'bar')
})
```

Then from your terminal

```sh
./node_modules/.bin/typed-test foo.test.ts

# supports globs
./node_modules/.bin/typed-test *.test.ts
```

## API

#### `describe(what: string, tests: Array<Test | TestCollection>): TestCollection`

Allows creating a collection of tests that are related to one another, useful
for when you have many tests for a class or function.

#### `given(what: string, tests: Array<Test | TestCollection>): TestCollection`

Just like `describe`, but with a nice descriptive name for your tests to read
like natural language.

#### `it(does: string, test: (assertions: Assertions, done: Done) => any): Test`

Currently the only `Test` returning function provided, which allows you to write
your tests.

```typescript
import { it } from '@typed/test'

export const testOne =
  it(
    `You must use assertions provided`,
    ({ equal, notEqual, notOk, ok, rejects, same, throws }) => {
      // assertions are counted and if none are called, your test will fail
    },
  )

export const testTwo =
  it(
    `The test function has an optional 'done' callback for async tests`,
    ({ ok }, done) => {
      setTimeout(() => {
        ok(true)
        done() // test is finished
        done(new Error(`Test will fail`))
      })
    }
  )

export const testThree =
  it(
    `Supports the returning of promises`,
    ({ eq }) => Promise.resolve(1).then(eq(1)) // assertions are curried!
  )
```

## Types

```typescript
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

export  type Results = Record<
  string,
  TestResult | TestResults | ReadonlyArray<TestResult | TestResults>
>

// all assertions are actually curried!
export interface Assertions {
  readonly equal: <A>(expected: A, actual: A): A;
  readonly notEqual: <A>(expected: A, actual: A): A;
  readonly notOk: (actual: boolean): boolean;
  readonly ok: (actual: boolean): boolean;
  readonly rejects: <Err extends Error = Error>(promise: Promise<any>) => Promise<Err>;
  readonly same: <A>(expected: A, actual: A): A;
  readonly throws: <Err extends Error = Error>(fn: () => any): Err
}

export interface Stats {
  count: number
}

export interface AssertionEnvironment {
  stats: Stats
  assertions: Assertions
}

```