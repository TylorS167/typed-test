import * as bodyParser from 'body-parser'
import * as expand from 'glob-expand'
import * as express from 'express'
import * as path from 'path'

import { cross, tick } from 'typed-figures'
import { fromPairs, keys, length, map } from '167'
import { green, red } from 'typed-colors'

import { ParsedArgs } from '../types'
import { defaultConfig } from './defaultConfig'
import { options } from './options'
import { resolveAliases } from '../resolveAliases'
import { tempDir } from '../tempDir'

const { paths = {}, baseUrl = '' } = options
const cwd = process.cwd()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 7677

const Webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const browserLauncher = require('james-browser-launcher')

export async function run(args: ParsedArgs, timeout: number) {
  const config = webpackMerge(
    defaultConfig,
    typeof args.config === 'string' ? require(path.join(cwd, args.config)) : {}
  )
  const testFiles = map(file => path.join(cwd, file), expand({ cwd, filter: 'isFile' }, args._))
  const entries: Array<[string, string]> = [
    ...map((file, i): [string, string] => [`test${i}`, file], testFiles),
    [`bundle`, path.join(__dirname, 'test-bundle.js')],
  ]
  const pathCount = length(keys(paths))
  const aliases = map(
    ([aliasName, aliasPath]): [string, string] => [
      aliasName,
      aliasPath.replace('/' + tempDir.name, pathCount > 1 ? '/' + path.relative(cwd, baseUrl) : ''),
    ],
    resolveAliases(testFiles, paths, baseUrl)
  )

  config.entry = fromPairs(entries)
  config.plugins.push(new Webpack.DefinePlugin({ TIMEOUT: timeout }))

  if (length(keys(config.resolve.alias)) === 0)
    Object.assign(config.resolve.alias, fromPairs(aliases))

  const compiler = Webpack(config)
  const server = createServer()

  console.log('Bundling tests with webpack...')
  compiler.run((err: any, stats: any) => {
    logErrors(err, stats)

    server.listen(PORT, '0.0.0.0', async () => {
      console.log(`Test server running on port ${PORT}`)

      launchBrowser()
    })
  })
}

function logErrors(err: any, stats: any) {
  if (err) {
    console.log(err)

    process.exit(1)
  }

  const { errors } = stats.toJson()

  if (stats.hasErrors()) {
    errors.forEach(console.error)

    process.exit(1)
  }
}

function createServer() {
  const server = express()

  server.use(express.static(tempDir.name))
  server.use(bodyParser.json())

  server.post('/log', handleLog)
  server.post('/end-server', handleEndServer)

  return server
}

function launchBrowser() {
  const url = `http://localhost:${PORT}`

  return new Promise((resolve, reject) => {
    browserLauncher((err: Error, launch: any) => {
      if (err) return reject(err)

      launch(
        url,
        {
          browser: process.env.BROWSER || 'chrome',
          options: [`--disable-gpu`],
        },
        (error: Error, instance: any) => {
          process.on('exit', () => {
            instance.stop()
          })

          if (error) return reject(error)

          console.log('Browser started with PID:', instance.pid)
          resolve()
        }
      )
    })
  })
}

function handleEndServer(request: express.Request, response: express.Response) {
  response.send()

  const { body } = request

  const failed = parseFloat(body['failed'])
  const passed = parseFloat(body['passed'])

  console.log()
  console.log('@typed/test -- ' + Date())

  console.log(
    body['toString']
      .replace(/âœ”/g, tick)
      .replace(/âœ/g, cross + ' ')
      .replace(/(\n)/, '\n  ')
  )

  console.log()
  console.log(`${red(String(failed))} Failed`)
  console.log(`${green(String(passed))} Passed`)
  console.log()

  if (failed > 0) {
    console.error(`------------------------------------Errors------------------------------------`)
    console.error('  ' + body['errors'].replace(/âœ/g, cross + ' '))
  }

  process.exit(failed)
}

function handleLog(request: express.Request & { body: any }, response: express.Response) {
  console.log(request.body)

  response.send()
}
