import * as rimraf from 'rimraf'
import * as tmp from 'tmp'

export const tempDir = tmp.dirSync({ template: '.typed-test-XXXXXX' })

const cleanup = () => rimraf.sync(tempDir.name)

process.on('SIGINT', () => {
  cleanup()
  process.exit(1)
})

process.on('exit', cleanup)
