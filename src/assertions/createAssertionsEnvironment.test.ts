import * as assert from 'assert'

import { createAssertionsEnvironment } from './createAssertionsEnvironment'

describe(`createAssertionsEnvironment`, () => {
  it(`returns an object containing all assertions`, () => {
    const { assertions } = createAssertionsEnvironment()

    assert.ok(assertions.hasOwnProperty('equal'))
    assert.ok(assertions.hasOwnProperty('notEqual'))
    assert.ok(assertions.hasOwnProperty('notOk'))
    assert.ok(assertions.hasOwnProperty('ok'))
    assert.ok(assertions.hasOwnProperty('rejects'))
    assert.ok(assertions.hasOwnProperty('same'))
    assert.ok(assertions.hasOwnProperty('throws'))
  })

  it(`returns an object containing the number of assertions called`, () => {
    const { stats, assertions } = createAssertionsEnvironment()

    assert.strictEqual(stats.count, 0)

    assertions.ok(true)

    assert.strictEqual(stats.count, 1)
  })
})
