#!/usr/bin/env node

import * as expand from 'glob-expand'
import * as fs from 'fs'
import * as yargs from 'yargs'

import { dirname, join } from 'path'

import { bold } from 'typed-colors'
import { displayResult } from './displayResult'
import { isTest } from './internal'
import { map, copy } from '167'
import { sequence } from '@typed/sequence'

const parsedArgs = yargs
  .usage('Usage: $0 -r [node_module] ...files')
  .alias('r', 'require')
  .argv

if (parsedArgs.help)
  yargs.showHelp()
else {
  if (Array.isArray(parsedArgs.require))
    parsedArgs.require.forEach(require)
  else if (parsedArgs.require)
    // tslint:disable-next-line:no-var-requires
    require(parsedArgs.require)

  const { _: files } = parsedArgs

  runTests(getTestFiles(files))

  if (parsedArgs.watch) {
    watch(files)
  }
}

function getTestFiles(files: Array<string>) {
  return map(
    (path) => join(process.cwd(), path),
    expand({ filter: 'isFile' }, files),
  ) as Array<string>
}

function destroyCache() {
  const cache = copy<string>(require.cache)

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < cache.length; ++i)
    delete require.cache[cache[i]]
}

function runTests(testFiles: Array<string>) {
  destroyCache()

  console.log('\x1Bc')
  console.log(bold(`Typed Test`))

  console.time(`\nTests run in`)

  const tests: Array<any> = []

  testFiles.forEach((file) => {
    // tslint:disable-next-line:no-var-requires
    const pkg = require(file)

    if (isTest(pkg))
      tests.push(pkg)

    Object.keys(pkg).forEach((key) => {
      if (isTest(pkg[key]))
        tests.push(pkg[key])
    })
  })

  sequence(tests, (test) => displayResult(test).then(console.log, console.error))
    .then(() => {
      console.timeEnd(`\nTests run in`)
      testFiles.forEach((file) => {
        delete require.cache[file]
      })
    })
}

const testNames = [ '.test', '.spec', 'Spec', 'Test', '-spec', '-test' ]

function watch(files: Array<string>) {
  let testFiles = getTestFiles(files)

  const testDirectories = Array.from(new Set(map(dirname, testFiles)))

  const isTestFile = (file: string) => testFiles.indexOf(file) > -1

  testDirectories.forEach((dir) => {
    fs.watch(dir, { recursive: true }, (_, fileName: string) => {

      testFiles = getTestFiles(files)

      if (isTestFile(join(dir, fileName)))
        return runTests([ join(dir, fileName) ])

      for (const name of testNames)
        if (isTestFile(adjustFileName(name, join(dir, fileName)))) {
          delete require.cache[join(dir, fileName)]
          delete require.cache[adjustFileName(name, join(dir, fileName))]

          return runTests([ adjustFileName(name, join(dir, fileName)) ])
        }

      runTests(testFiles)
    })
  })
}

function adjustFileName(post: string, fileName: string): string {
  const [ pre ] = fileName.split('.ts')

  return pre + `${post}.ts`
}
