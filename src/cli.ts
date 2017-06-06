#!/usr/bin/env node

import * as expand from 'glob-expand'
import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import * as yargs from 'yargs'

import { Test, TestCollection, TestResult, TestResults } from './types'
import { displayTestResult, displayTestResults } from './displayTestResults'
import { flatten, map } from '167'
import { isTest, isTestCollection, isTestResult, isTestResults } from './tests'

type ParsedArgs = {
  _: Array<string>
  requires: string | Array<string>
  help: boolean
  timeout: string
  watch: boolean
}

require('ts-node/register')

const parsedArgs: ParsedArgs = yargs
  .usage(
    `\n$0 [fileGlobs]\n\n` +
      `  --require  -r    :: Require packages before running tests\n` +
      `  --timeout  -t    :: Set default timeout for tests`
  )
  .option('require', { alias: 'requires', requiresArg: false })
  .option('timeout', { alias: 't' })
  .showHelpOnFail(true).argv

const cwd = process.cwd()

const globalTimeout = isNaN(parseFloat(parsedArgs.timeout)) ? 2000 : parseFloat(parsedArgs.timeout)

if (parsedArgs.help) {
  yargs.showHelp()
} else {
  run(parsedArgs)
}

function run(args: ParsedArgs) {
  const { _: fileGlobs, requires } = args

  if (requires) flatten([requires]).forEach(require)

  const testFiles = map(file => path.join(cwd, file), expand({ cwd, filter: 'isFile' }, fileGlobs))

  return Promise.all(testFiles.map(runTest(globalTimeout))).then(results => {
    flatten(results).forEach(result => console.log(result))
  })
}

function runTest(timeout: number) {
  return function(filename: string) {
    const contents = fs.readFileSync(filename).toString()

    const configPath = ts.findConfigFile(cwd, (fileName: string) => fs.existsSync(fileName))

    const { config: { compilerOptions } } = ts.parseConfigFileTextToJson(
      configPath,
      fs.readFileSync(configPath).toString()
    )

    const { options } = ts.convertCompilerOptionsFromJson(compilerOptions, cwd)

    const source = ts.transpileModule(contents, options).outputText

    const pkg = requireFromString(source, filename)

    const tests: Array<Test | TestCollection> = []

    if (isTest(pkg) || isTestCollection(pkg)) tests.push(pkg)

    for (const key in pkg) if (isTest(pkg[key]) || isTestCollection(pkg[key])) tests.push(pkg[key])

    const testResults = Promise.all<TestResult | TestResults>(tests.map(test => test.run(timeout)))

    return testResults.then(results => {
      return results
        .map((result, i) => {
          if (isTestResults(result)) return displayTestResults(tests[i].name, result)
          if (isTestResult(result)) return displayTestResult(tests[i].name, result)
        })
        .filter(Boolean)
    })
  }
}

function requireFromString(contents: string, filename: string) {
  const newModule = new (module as any).constructor()

  newModule._compile(contents, filename)

  return newModule.exports
}
