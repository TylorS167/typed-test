import { Done, GroupTest, SingularTest, Test } from './types'
import { createTestRun, isGroupTest } from './internal'

import { flatten } from '167'

export function beforeEach<A>(
  before: (done: Done) => A | Promise<A>,
  ...tests: Array<Test | Array<Test>>): Array<Test>
{
  return flatten(tests).map((test: Test) => {
    if (isGroupTest(test))
      return augmentGroupTest(before, test)

    return augmentTest(before, test)
  })
}

function augmentGroupTest<A>(
  before: (done: Done) => A | Promise<A>,
  test: GroupTest): GroupTest
{
  const tests: Array<Test> = []

  for (const t of test.tests)
    tests.push(...beforeEach(before, t))

  return {
    ...test,
    tests: flatten<Test>(tests),
  }
}

function augmentTest<A>(
  before: (done: Done) => A | Promise<A>,
  test: SingularTest): SingularTest
{
  const beforeRun = createTestRun(before, test.name)

  return {
    ...test,
    run() {
      return beforeRun()
        .then((result) => {
          if (result.passed) return test.run()

          return result
        })
    },
  }
}
