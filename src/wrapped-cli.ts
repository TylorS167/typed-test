#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import { resolveOne } from 'npm-module-path'

const { argv } = process

const willRunInBrowser = argv.indexOf('--browser') > -1
const willRunCoverage = argv.indexOf('--coverage') > -1
const shouldWrapWithNyc = !willRunInBrowser && willRunCoverage
const args = argv.slice(2)

findCommand()
  .then(cmd => execSync(cmd, { stdio: 'inherit' }))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

function findCommand(): Promise<string> {
  return Promise.all([findNycBin(), findTypedTestBin()]).then(
    ([nycBin, typedTestBin]) =>
      shouldWrapWithNyc
        ? `${[nycBin, typedTestBin, ...args].join(' ')}`
        : `${[typedTestBin, ...args].join(' ')}`
  )
}

function findNycBin(): Promise<string> {
  return resolveOne('nyc').then(nycDir => join(nycDir, 'bin', 'nyc.js'))
}

function findTypedTestBin(): Promise<string> {
  const nodeModuleBinPath = join(__dirname, 'typed-test')
  const localTestsPath = join(__dirname, 'cli.js')

  if (existsSync(nodeModuleBinPath)) return Promise.resolve(nodeModuleBinPath)

  if (existsSync(localTestsPath)) return Promise.resolve(localTestsPath)

  return resolveOne('@typed/test').then(typedTestDir => join(typedTestDir, 'lib', 'cli.js'))
}
