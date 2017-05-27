import { AssertionError, eq } from '@briancavalier/assert'
import { all, map } from '@typed/promises'
import { cross, tick } from 'typed-figures'

import { displayResult } from './displayResult'
import { strip } from 'typed-colors'
import { it as test } from './it'

describe(`displayTest`, () => {
  it(`returns a string representation of test result`, () => {
    const passingTest = test('works', (done) => done())
    const failingTest = test('does not work', (done) => done(new Error('foo')))
    const failingAssertionTest =
      test('does not work', (done) => done(new AssertionError('foo', 'a', 'b')))

    return all(
      map(eq(`${tick} it works`), map(strip, displayResult(passingTest))),
      map(
        eq(`${cross} it does not work` + `\n` + `  Error: foo\n`),
        map(strip, displayResult(failingTest)),
      ),
      map(
        eq(
          `${cross} it does not work` + `\n` + `  ` +
          `Error: foo\n  + expected - actual\n\n  - ${cross} b\n  + ${cross} a\n`),
        map(strip, displayResult(failingAssertionTest)),
      ),
    )
  })
})
