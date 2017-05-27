import { just, nothing } from '167'

import { eq } from '@briancavalier/assert'
import { it as test } from './it'

describe('it', () => {
  it('returns a Test', () => {
    const name = 'name'
    const error = new Error('foo')

    const itTestFails = test(name, () => { throw error })
    const itTestPasses = test(name, (done) => done())

    const hasFailed = eq({ name, passed: false, error: just(error) })
    const hasPassed = eq({ name, passed: true, error: nothing() })

    return Promise.all([
      itTestFails.run().then(hasFailed),
      itTestPasses.run().then(hasPassed),
    ])
  })
})
