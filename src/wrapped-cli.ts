#!/usr/bin/env node

import { join, resolve } from 'path'

import { execSync } from 'child_process'

const { argv } = process

const willRunInBrowser = argv.indexOf('--browser') > -1
const willRunCoverage = argv.indexOf('--coverage') > -1

if (!willRunInBrowser && willRunCoverage) {
  let nycDir = resolve('nyc')
  if (nycDir === join(process.cwd(), 'nyc')) nycDir = join(process.cwd(), 'node_modules/nyc')

  const nycBin = join(nycDir, 'bin', 'nyc.js')
  let typedTest = resolve('@typed/test')

  if (typedTest === join(process.cwd(), '@typed/test')) typedTest = process.cwd()

  const typedTestBin = join(typedTest, 'lib/cli.js')
  const cmd = `${[nycBin, typedTestBin, ...argv.slice(2)].join(' ')}`

  execSync(cmd, { stdio: 'inherit' })
} else {
  let typedTest = resolve('@typed/test')

  if (typedTest === join(process.cwd(), '@typed/test')) typedTest = process.cwd()

  const typedTestBin = join(typedTest, 'lib/cli.js')
  const cmd = `${[typedTestBin, ...argv.slice(2)].join(' ')}`

  execSync(cmd, { stdio: 'inherit' })
}
