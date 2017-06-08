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

import { red } from 'typed-colors'

type ParsedArgs = {
  _: Array<string>
  requires: string | Array<string>
  help: boolean
  timeout: string
  watch: boolean
}

const cwd = process.cwd()

const configPath = ts.findConfigFile(cwd, (fileName: string) => fs.existsSync(fileName))

const { config: { compilerOptions } } = ts.parseConfigFileTextToJson(
  configPath,
  fs.readFileSync(configPath).toString()
)

const { options } = ts.convertCompilerOptionsFromJson(
  { ...compilerOptions, module: 'commonjs', target: 'es5' },
  cwd
)

const parsedArgs: ParsedArgs = yargs
  .usage(
    `\n$0 [fileGlobs]\n\n` +
      `  --require  -r    :: Require packages before running tests\n` +
      `  --timeout  -t    :: Set default timeout for tests`
  )
  .option('require', { alias: 'requires', requiresArg: false })
  .option('timeout', { alias: 't' })
  .showHelpOnFail(true).argv

const globalTimeout = isNaN(parseFloat(parsedArgs.timeout)) ? 2000 : parseFloat(parsedArgs.timeout)

if (parsedArgs.help) {
  yargs.showHelp()
} else {
  run(parsedArgs)
}

function compile(m: typeof module, filePath: string) {
  const content = fs.readFileSync(filePath).toString()

  const { outputText } = ts.transpileModule(content, { compilerOptions: { ...options } })

  return (m as any)._compile(outputText, filePath)
}

let failed = false

function run(args: ParsedArgs) {
  const { _: fileGlobs, requires } = args

  require.extensions['.ts'] = compile
  require.extensions['.tsx'] = compile

  if (requires) flatten([requires]).forEach(require)

  const testFiles = map(file => path.join(cwd, file), expand({ cwd, filter: 'isFile' }, fileGlobs))

  console.time(`Tests Run In`)
  return Promise.all(testFiles.map(runTest(globalTimeout)))
    .then(results => {
      return flatten(results).forEach(result => console.log(result))
    })
    .then(() => {
      console.timeEnd(`Tests Run In`)
      if (failed) {
        console.log(
          `\n-------------------------------------${red(
            'Errors'
          )}-------------------------------------\n`
        )
        process.exit(1)
      } else process.exit(0)
    })
}

function runTest(timeout: number) {
  return function(filename: string) {
    const pkg = require(filename)

    const tests: Array<Test | TestCollection> = []

    if (isTest(pkg) || isTestCollection(pkg)) tests.push(pkg)

    for (const key in pkg) if (isTest(pkg[key]) || isTestCollection(pkg[key])) tests.push(pkg[key])

    const testResults = Promise.all<TestResult | TestResults>(tests.map(test => test.run(timeout)))

    return testResults.then(results => {
      return results
        .map((result, i) => {
          if (result.passed === false) {
            failed = true

            process.on('exit', () => {
              if (isTestResults(result)) console.error(displayTestResults(tests[i].name, result))
              if (isTestResult(result)) console.error(displayTestResult(tests[i].name, result))
            })
          }

          if (isTestResults(result)) return displayTestResults(tests[i].name, result)
          if (isTestResult(result)) return displayTestResult(tests[i].name, result)
        })
        .filter(Boolean)
    })
  }
}
