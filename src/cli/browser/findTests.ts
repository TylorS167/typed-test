import { Test } from '../../types'

export function findTests(filenames: ReadonlyArray<string>): Array<string> {
  const onlyTests: Array<string> = []
  const tests: Array<string> = []

  function add(test: Test, filename: string) {
    const { only } = test

    if (only)
      return onlyTests.push(filename)

    tests.push(filename)
  }

  for (const filename of filenames) {
    const pkg = require(filename)

    if (isTest(pkg)) add(pkg, filename)

    for (const key in pkg) if (isTest(pkg[key])) add(pkg[key], filename)
  }

  return Array.from(new Set(onlyTests.length === 0 ? tests : onlyTests))
}

function isTest(x: any): x is Test {
  return x && x.hasOwnProperty('only') && typeof x.run === 'function'
}
