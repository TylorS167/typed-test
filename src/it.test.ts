import { Test, describe, it } from './'
import { just, nothing } from '167'

import { eq } from '@briancavalier/assert'

export const test: Test = describe('it', [
  it('returns a Test', () => {
    const name = 'name'
    const error = new Error('foo')

    const itTestFails = it(name, () => { throw error })
    const itTestPasses = it(name, (done) => done())
    const itTestPassesPromise = it(name, () => Promise.resolve())

    const hasFailed = eq({ name, passed: false, error: just(error) })
    const hasPassed = eq({ name, passed: true, error: nothing() })

    return Promise.all([
      itTestFails.run().then(hasFailed),
      itTestPasses.run().then(hasPassed),
      itTestPassesPromise.run().then(hasPassed),
    ])
  }),
])
