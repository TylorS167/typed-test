import { Test } from '../../types'

export function findTests(filenames: ReadonlyArray<string>): ReadonlyArray<Test> {
  const onlyTests: Array<Test> = []
  const tests: Array<Test> = []

  function add(test: Test) {
    if (test.only) {
      onlyTests.push(test)
    } else tests.push(test)
  }

  for (const filename of filenames) {
    const pkg = require(filename)

    if (isTest(pkg)) add(pkg)

    for (const key in pkg) if (isTest(pkg[key])) add(pkg[key])
  }

  return onlyTests.length === 0 ? tests : onlyTests
}

function isTest(x: any): x is Test {
  return x && x.hasOwnProperty('only') && typeof x.run === 'function'
}
