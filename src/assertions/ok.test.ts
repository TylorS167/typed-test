import * as assert from 'assert'

import { ok } from './ok'

describe(`ok`, () => {
  describe(`given true`, () => {
    it(`returns true`, () => {
      const value = ok(true)

      assert.strictEqual(value, true)
    })
  })

  describe(`given false`, () => {
    it(`throws an Error`, () => {
      try {
        ok(false)
        throw new Error(`Should throw error`)
      } catch (e) {
        assert.strictEqual(e.message, `Value is not truthy`)
      }
    })
  })
})
