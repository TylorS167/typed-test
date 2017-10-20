import * as expand from 'glob-expand'
import * as path from 'path'

import { chain, fromPairs, keys, length, zip } from '167'

import { ParsedArgs } from '../types'
import { defaultConfig } from './defaultConfig'
import { options } from '../options'

// import { resolveAliases } from '../resolveAliases'
// import { tempDir } from '../tempDir'

const { paths = {}, baseUrl = '' } = options
const cwd = process.cwd()

const Webpack = require('webpack')
const webpackMerge = require('webpack-merge')

export function buildCompiler(args: ParsedArgs, timeout: number): Compiler {
  const config = webpackMerge(
    defaultConfig,
    typeof args.config === 'string' ? require(path.join(cwd, args.config)) : {}
  )
  const testFiles = expand({ cwd, filter: 'isFile' }, args._).map(file => path.join(cwd, file))
  const entries: Array<[string, string]> = [
    ...testFiles.map((file, i): [string, string] => [`test${i}`, file]),
    [`bundle`, path.join(__dirname, 'test-bundle.js')],
  ]
  const aliasNames = keys(paths)
  const aliasPaths = chain(
    name => paths[name].map(aliasPath => path.join(baseUrl, aliasPath)),
    aliasNames
  )

  const aliases = zip(aliasNames.map(stripExtraCharacters), aliasPaths.map(stripExtraCharacters))

  config.entry = fromPairs(entries)

  config.plugins.push(new Webpack.DefinePlugin({ TIMEOUT: timeout }))

  if (length(keys(config.resolve.alias)) === 0)
    Object.assign(config.resolve.alias, fromPairs(aliases))

  return Webpack(config) as Compiler
}

function stripExtraCharacters(str: string): string {
  return str
    .replace('*', '')
    .replace('./', '')
    .replace(/\/$/, '')
}

export interface Compiler {
  run(callback: (err: any, stats: any) => any): void
  watch(options: any, callback: (err: any, stats: any) => any): void
  close(callback?: () => void): void
}
