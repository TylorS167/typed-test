#!/usr/bin/env node

import * as yargs from 'yargs'

import { ParsedArgs } from './cli/types'
import { errorToString } from 'assertion-error-diff'
import { run } from './cli/run'

const parsedArgs: ParsedArgs = (yargs
  .usage(
    `\n$0 [fileGlobs]\n\n` +
      `  --require  -r    :: Require packages before running tests\n` +
      `  --timeout  -t    :: Set default timeout for tests`
  )
  .option('require', { alias: 'requires', requiresArg: false })
  .option('timeout', { alias: 't' })
  .showHelpOnFail(true).argv as any) as ParsedArgs

const globalTimeout = Number.isNaN(parseFloat(parsedArgs.timeout))
  ? 2000
  : parseFloat(parsedArgs.timeout)

if (parsedArgs.help) {
  yargs.showHelp()
} else {
  run(parsedArgs, globalTimeout).catch(err => {
    console.error(errorToString(err))
  })
}
