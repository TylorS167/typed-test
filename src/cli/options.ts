import * as fs from 'fs'
import * as ts from 'typescript'

import { join } from 'path'
import { tempDir } from './tempDir'

const cwd = process.cwd()

const configPath = ts.findConfigFile(cwd, (fileName: string) => fs.existsSync(fileName))

const { config } = ts.parseConfigFileTextToJson(configPath, fs.readFileSync(configPath).toString())
const { compilerOptions } = config

export const CONFIG_PATH = join(cwd, tempDir.name, 'tsconfig.json')

const updatedCompilerOptions = {
  ...compilerOptions,
  declaration: false,
  module: 'commonjs',
  target: 'es5',
  noEmit: false,
  noEmitOnError: true,
  outDir: tempDir.name,
}

export const { options } = ts.convertCompilerOptionsFromJson(updatedCompilerOptions, cwd)

fs.writeFileSync(
  CONFIG_PATH,
  JSON.stringify({ ...config, compilerOptions: updatedCompilerOptions })
)
