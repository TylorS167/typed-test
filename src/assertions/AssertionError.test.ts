import * as assert from 'assert'

import { AssertionError } from './AssertionError'

describe('AssertionError', () => {
  it('is a subclass of Error', () => {
    const error = new AssertionError('foo', 'foo', 'bar')

    assert.ok(error instanceof Error)
  })

  it('has addition properties `actual` and `expected`', () => {
    const error = new AssertionError('', 'foo', 'bar')

    assert.strictEqual(error.expected, 'foo')
    assert.strictEqual(error.actual, 'bar')
  })
})
