import { AssertionError, eq } from '@briancavalier/assert'
import { Test, describe, it } from './'
import { all, map } from '@typed/promises'
import { cross, tick } from 'typed-figures'

import { displayResult } from './displayResult'
import { strip } from 'typed-colors'

export const test: Test =
  describe(`displayTest`,
    it(`returns a string representation of test result`, () => {
      const passingTest = it('works', (done) => done())
      const failingTest = it('does not work', (done) => done(new Error('foo')))
      const failingAssertionTest =
        it('does not work', (done) => done(new AssertionError('foo', 'a', 'b')))

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
    }),
)
