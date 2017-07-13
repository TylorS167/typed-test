import { Test, describe, given, it } from './'

const TIMEOUT_MS = 100

export const test: Test = describe(`it`, [
  given(`what it does, and a test function with no assertions`, [
    it(`returns a failing test`, async ({ equal }) => {
      const test: Test = it('does stuff', () => {})

      const result = await test.run(TIMEOUT_MS)

      const { passed, failed } = result.report()

      equal(1, failed)
      equal(0, passed)
    }),
  ]),

  given(`what it does, and test functoin that uses assertions`, [
    it(`returns a passing test if assertion is true`, async ({ equal }) => {
      const test: Test = it('does stuff', ({ ok }) => {
        ok(true)
      })

      const result = await test.run(TIMEOUT_MS)

      const { passed, failed } = result.report()

      equal(0, failed)
      equal(1, passed)
    }),

    it(`returns a failing test if assertion is false`, async ({ equal }) => {
      const test: Test = it('does stuff', ({ ok }) => {
        ok(false)
      })

      const result = await test.run(TIMEOUT_MS)

      const { passed, failed } = result.report()

      equal(0, passed)
      equal(1, failed)
    }),
  ]),

  given(`what it does, and a resolved promise returning test function`, [
    it(`returns a passing test`, async ({ equal }) => {
      const test: Test = it('does stuff', ({ ok }) => {
        return Promise.resolve(true).then(ok)
      })

      const result = await test.run(TIMEOUT_MS)

      const { passed, failed } = result.report()

      equal(1, passed)
      equal(0, failed)
    }),
  ]),

  given(`what it does, and a rejected promise returning test function`, [
    it(`returns a failing test`, async ({ equal }) => {
      const test: Test = it('does stuff', ({ ok }) => {
        return Promise.resolve(false).then(ok)
      })

      const result = await test.run(TIMEOUT_MS)

      const { passed, failed } = result.report()

      equal(0, passed)
      equal(1, failed)
    }),
  ]),

  given(`what it does, and a asnyc test function with no assertions`, [
    it(`returns a failing test`, async ({ equal }) => {
      const test: Test = it('does stuff', (_, done) => {
        setTimeout(() => done(), 5)
      })

      const result = await test.run(TIMEOUT_MS)

      const { passed, failed } = result.report()

      equal(0, passed)
      equal(1, failed)
    }),
  ]),

  given(`what it does, and a asnyc test function with assertions`, [
    it(`returns a passing test`, async ({ equal }) => {
      const test: Test = it('does stuff', (assert, done) => {
        setTimeout(() => {
          assert.ok(true)
          done()
        }, 5)
      })

      const result = await test.run(TIMEOUT_MS)

      const { passed, failed } = result.report()

      equal(1, passed)
      equal(0, failed)
    }),
  ]),

  given(`what it does, and a test function returning a promise and uses done callback`, [
    it(`returns a failing test`, async ({ equal }) => {
      const test: Test = it('does stuff', (_, done) => {
        return Promise.resolve().then(() => done())
      })

      const result = await test.run(TIMEOUT_MS)

      const { passed, failed } = result.report()

      equal(1, failed)
      equal(0, passed)
    }),
  ]),

  given(`what it does and a test function that exceeds timeout`, [
    it(`returns a failing test`, async ({ equal }) => {
      const test: Test = it('does stuff', (assert, done) => {
        setTimeout(() => {
          assert.ok(true)
          done()
        }, 10)
      })

      const result = await test.run(5)

      const { passed, failed } = result.report()

      equal(1, failed)
      equal(0, passed)
    }),
  ]),
])
