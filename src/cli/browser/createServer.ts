import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'

import { cross, tick } from 'typed-figures'

import { Result } from '../../types'
import { tempDir } from '../tempDir'
import { values } from '167'

const fileUpload = require('express-fileupload')
const cwd = process.cwd()

export function createServer(
  log: (message: string) => any,
  error: (message: string) => any,
  result: (result: Result) => any
): express.Express {
  const server = express()

  server.use(express.static(tempDir.name))
  server.use(bodyParser.json())
  server.use(fileUpload())

  server.post('/log', (request: express.Request, response: express.Response) => {
    log(request.body)

    response.end()
  })

  server.post('/error', (request: express.Request, response: express.Response) => {
    error(request.body)

    response.end()
  })

  server.post(
    '/coverage',
    (request: express.Request & { files: Files }, response: express.Response) => {
      const [{ data }] = values(request.files)
      const nycOutput = path.join(cwd, '.nyc_output')
      const jsonFile = path.join(nycOutput, 'out.json')

      if (!fs.existsSync(nycOutput)) fs.mkdirSync(nycOutput)

      fs.writeFileSync(jsonFile, data)

      response.end()
    }
  )

  server.post('/end-server', (request: express.Request, response: express.Response) => {
    response.send()

    const { body } = request

    const numberOfFailedTests = parseFloat(body['failed'])
    const numberOfPassingTests = parseFloat(body['passed'])

    const toString = () =>
      body['toString']
        .replace(/âœ”/g, tick)
        .replace(/âœ/g, cross + ' ')
        .replace(/(\n)/, '\n  ')

    const errors = () => '  ' + body['errors'].replace(/âœ/g, cross + ' ')

    const report = () => ({ failed: numberOfFailedTests, passed: numberOfPassingTests })

    result({ toString, errors, report })
  })

  return server
}

type Files = {
  [key: string]: File
}

type File = {
  name: string
  mv: Function
  mimetype: string
  data: Buffer
}
