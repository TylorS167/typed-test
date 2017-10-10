import * as bodyParser from 'body-parser'
import * as browserify from 'browserify'
import * as expand from 'glob-expand'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'

import { cross, tick } from 'typed-figures'
import { green, red } from 'typed-colors'

import { ParsedArgs } from '../types'
import { compile } from './compile'
import { createHtmlFile } from './createHtmlFile'
import { findTests } from './findTests'
import { map } from '167'
import { tempDir } from '../tempDir'

const cwd = process.cwd()

const browserLauncher = require('james-browser-launcher')

export async function run(args: ParsedArgs, timeout: number) {
  const bundlePath = path.join(tempDir.name, './bundle.js')
  const testFiles = map(file => path.join(cwd, file), expand({ cwd, filter: 'isFile' }, args._))
  const compiledTestFilePaths = findTests(compile(testFiles))
  const browserifyOptions = require(path.join(cwd, 'package.json'))['browserify'] || {}
  const bundler = browserify(compiledTestFilePaths, browserifyOptions)
  const typedTest =
    process.cwd() === path.join(__dirname, '../../..')
      ? path.join(tempDir.name, 'index.js')
      : '@typed/test'

  bundler.require(typedTest, { expose: '@typed/test' })

  compiledTestFilePaths.forEach(name => bundler.require(name))

  await createBundle(bundler, bundlePath)

  fs.writeFileSync(
    path.join(tempDir.name, 'index.html'),
    createHtmlFile(compiledTestFilePaths, timeout)
  )

  const server = express()

  server.use(express.static(tempDir.name))
  server.use(bodyParser.json())

  server.post('/log', handleLog)

  server.post('/end-server', handleEndServer)

  const PORT = 42167

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on port ${PORT}`)

    browserLauncher((err: Error, launch: any) => {
      if (err) {
        console.error(err.stack)
        process.exit(1)
      }

      launch(
        `http://localhost:${PORT}`,
        {
          browser: process.env.BROWSER || 'chrome',
          options: [`--disable-gpu`],
        },
        (error: Error, instance: any) => {
          process.on('exit', () => {
            instance.stop()
          })

          if (error) {
            console.error(error.stack)
            process.exit(1)
          }

          console.log('Browser started with PID:', instance.pid)
        }
      )
    })
  })
}

function handleEndServer(request: express.Request, response: express.Response) {
  const { body } = request

  const failed = parseFloat(body['failed'])
  const passed = parseFloat(body['passed'])

  console.log(
    body['toString']
      .replace(/âœ”/g, tick)
      .replace(/âœ/g, cross + ' ')
      .replace(/(\n)/, '\n  ')
  )

  if (failed > 0) {
    console.log()
    console.error(`------------------------------------Errors------------------------------------`)
    console.error('  ' + body['errors'].replace(/âœ/g, cross + ' '))
  }

  console.log()
  console.log(`${red(String(failed))} Failed`)
  console.log(`${green(String(passed))} Passed`)

  response.send()

  process.exit(failed)
}

function handleLog(request: express.Request & { body: any }, response: express.Response) {
  console.log(JSON.parse(request.body))

  response.send()
}

async function createBundle(bundler: browserify.BrowserifyObject, filePath: string) {
  return new Promise((resolve, reject) => {
    console.log('Bundling your test files for the browser...')
    bundler.bundle((err: any, src: Buffer) => {
      if (err) return reject(err)

      try {
        fs.writeFileSync(filePath, src)
        resolve(src)
      } catch (e) {
        reject(e)
      }
    })
  })
}
