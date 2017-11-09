import { Test } from '../../types'
import { TestResults } from '../../results'

const __log = console.log.bind(console)

function log(...values: Array<any>) {
  __log(...values)

  fetch(location.origin + '/log', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(values.map(x => JSON.stringify(x, null, 2)))
  })
}

console.log = log

const __error = console.error.bind(console)

function error(...values: Array<any>) {
  __error(...values)

  fetch(location.origin + '/error', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(values.map(x => JSON.stringify(x, null, 2)))
  })
}

console.error = error

const testFiles: Array<any> = []
const tests: Array<Test> = []

testFiles.forEach(findTests)

function findTests(pkg: any): void {
  if (isTest(pkg)) tests.push(pkg)

  for (const key in pkg) if (isTest(pkg[key])) tests.push(pkg[key])
}

function isTest(x: any): x is Test {
  return x && x.hasOwnProperty('only') && typeof x.run === 'function'
}

const timeout = window.TIMEOUT || 2000

Promise.all(tests.map(test => test.run(timeout))).then(results => {
  const overallResults = new TestResults('', results)
  const { failed, passed } = overallResults.report()
  const headers = new Headers({ 'Content-Type': 'application/json' })
  const rootNode = document.getElementById('root')
  const passing = document.createElement('h3')
  const failing = document.createElement('h3')
  const body = JSON.stringify({
    passed,
    failed,
    toString: overallResults.toString(),
    errors: overallResults.errors()
  })

  passing.textContent = String(passed) + ' Passing'
  failing.textContent = String(failed) + ' Failed'
  rootNode.appendChild(passing)
  rootNode.appendChild(failing)

  return sendCoverageFile(window.__coverage__).then(() =>
    fetch(location.origin + '/end-server', {
      method: 'POST',
      headers,
      body
    })
  )
})

function sendCoverageFile(coverage: any): Promise<any> {
  if (!coverage || !window.COVERAGE) return Promise.resolve()

  const file = new File([JSON.stringify(coverage, null, 2)], 'out.json')
  const data = new FormData()
  data.append('file', file)
  const url = location.origin + '/coverage'

  return fetch(url, { method: 'POST', body: data })
}

declare global {
  export interface Window {
    TIMEOUT: number
    COVERAGE: number
    __coverage__: any
  }
}
