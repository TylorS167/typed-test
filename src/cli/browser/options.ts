import * as fs from 'fs'
import * as ts from 'typescript'

import { tempDir } from '../tempDir'

const cwd = process.cwd()

const configPath = ts.findConfigFile(cwd, (fileName: string) => fs.existsSync(fileName))

const { config: { compilerOptions } } = ts.parseConfigFileTextToJson(
  configPath,
  fs.readFileSync(configPath).toString()
)

export const { options } = ts.convertCompilerOptionsFromJson(
  {
    ...compilerOptions,
    module: 'commonjs',
    target: 'es5',
    noEmit: false,
    noEmitOnError: true,
    outDir: tempDir.name,
  },
  cwd
)
