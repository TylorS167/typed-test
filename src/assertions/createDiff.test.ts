import * as assert from 'assert'

import { bold, green, red } from 'typed-colors'

import { AssertionError } from './AssertionError'
import { createDiff } from './createDiff'

describe(`createDiff`, () => {
  describe(`given an AssertionError comparing two simple object`, () => {
    it(`creates a diff string to compare expected and actual values`, () => {
      const error = new AssertionError('Items are not equal to each other', { a: 1 }, { a: 2 })

      const diff = createDiff(error)

      assert.strictEqual(
        diff,
        bold(`AssertionError: Items are not equal to each other\n`) +
          `  ${red('- expected')} ${green('+ actual')}\n\n` +
          `  {\n` +
          `  ${green('+')} "a": 2\n` +
          `  ${red('-')} "a": 1\n` +
          `  }\n`
      )
    })
  })

  describe(`given an AssertionError comparing two deep objects`, () => {
    it(`shows a string diff of changes`, () => {
      const expected = { a: 1, b: { c: { d: 6 } } }
      const actual = { a: 1, b: { c: { d: 7 } } }

      const diff = createDiff(
        new AssertionError('Items are not equal to each other', expected, actual)
      )

      assert.strictEqual(
        diff,
        bold(`AssertionError: Items are not equal to each other\n`) +
          `  ${red('- expected')} ${green('+ actual')}\n\n` +
          `  {\n` +
          `    "a": 1,\n` +
          `    "b": {\n` +
          `      "c": {\n` +
          `  ${green('+')}     "d": 7\n` +
          `  ${red('-')}     "d": 6\n` +
          `      }\n` +
          `    }\n` +
          `  }\n`
      )
    })
  })

  describe(`given an AssertionError comparing two arrays`, () => {
    it(`shows a diff of changes`, () => {
      const expected = [1, 2, 3, 4, 5]
      const actual = [1, 2, 3, 5, 4]

      const diff = createDiff(
        new AssertionError('Items are not equal to each other', expected, actual)
      )

      assert.strictEqual(
        diff,
        bold(`AssertionError: Items are not equal to each other\n`) +
          `  ${red('- expected')} ${green('+ actual')}\n\n` +
          `  [\n` +
          `    1,\n` +
          `    2,\n` +
          `    3,\n` +
          `  ${red('-')} 4,\n` +
          `    5,\n` +
          `  ${green('+')} 4\n` +
          `  ]\n`
      )
    })
  })
})
