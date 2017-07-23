import * as browserify from 'browserify'
import * as expand from 'glob-expand'
import * as fs from 'fs'
import * as path from 'path'

import { cross, tick } from 'typed-figures'
import { green, red } from 'typed-colors'

import { ParsedArgs } from '../types'
import { compile } from './compile'
import { createHtmlFile } from './createHtmlFile'
import { createServer } from 'http'
import { findTests } from './findTests'
import { map } from '167'
import { tempDir } from '../tempDir'

const cwd = process.cwd()

const browserLauncher = require('james-browser-launcher')

export function run(args: ParsedArgs, timeout: number) {
  const testFiles = map(file => path.join(cwd, file), expand({ cwd, filter: 'isFile' }, args._))

  const compiledTestFilePaths = findTests(compile(testFiles))

  const bundler = browserify(compiledTestFilePaths)

  const typedTest =
    process.cwd() === path.join(__dirname, '../../..')
      ? path.join(tempDir.name, 'index.js')
      : '@typed/test'

  bundler.require(typedTest, { expose: '@typed/test' })

  compiledTestFilePaths.forEach(name => bundler.require(name))

  return new Promise((resolve, reject) => {
    console.log('Bundling your test files for the browser...')
    bundler.bundle((err: any, src: Buffer) => {
      if (err) return reject(err)

      try {
        fs.writeFileSync(path.join(tempDir.name, './bundle.js'), src)
        resolve(src)
      } catch (e) {
        reject(e)
      }
    })
  }).then(bundle => {
    const htmlFile = createHtmlFile(compiledTestFilePaths, timeout)

    const server = createServer((request, response) => {
      const bodyParts: Array<any> = []

      request.on('data', chunk => bodyParts.push(chunk))

      if (request.url.endsWith('bundle.js')) {
        response.end(bundle)
      } else if (request.url.endsWith('/end-server')) {
        request.on('end', () => {
          const body: any = JSON.parse(Buffer.concat(bodyParts).toString())

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
            console.error(
              `------------------------------------Errors------------------------------------`
            )
            console.error('  ' + body['errors'].replace(/âœ/g, cross + ' '))
          }

          console.log()
          console.log(`${red(String(failed))} Failed`)
          console.log(`${green(String(passed))} Passed`)

          response.end()

          process.exit(failed)
        })
      } else {
        response.end(htmlFile)
      }
    })

    const PORT = 42167

    server.listen(PORT, '0.0.0.0', () => {
      console.log('Test server running on port 8080')

      browserLauncher((err: Error, launch: any) => {
        if (err) {
          console.error(err.stack)
          process.exit(1)
        }

        launch(
          `http://localhost:${PORT}`,
          {
            browser: process.env.BROWSER || 'chrome',
            options: [`http://localhost:${PORT}`, `--disable-gpu`],
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
  })
}
