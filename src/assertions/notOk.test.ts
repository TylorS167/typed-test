import * as assert from 'assert'

import { notOk } from './notOk'

describe(`notOk`, () => {
  describe(`given false`, () => {
    it(`returns false`, () => {
      const value = notOk(false)

      assert.strictEqual(value, false)
    })
  })

  describe(`given true`, () => {
    it(`throws an Error`, () => {
      try {
        notOk(true)
        throw new Error(`Should throw error`)
      } catch (e) {
        assert.strictEqual(e.message, `Value is truthy`)
      }
    })
  })
})
