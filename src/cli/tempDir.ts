import * as rimraf from 'rimraf'

try {
  // Requiring 'tmp' will throw when compiling for browsers
  // due to lack of support for 'process.binding'.
  const tmp = require('tmp')
  const tempDir = exports.tempDir = tmp.dirSync({ template: '.typed-test-XXXXXX' })

  const cleanup = () => rimraf.sync(tempDir.name)

  process.on('SIGINT', () => {
    cleanup()
    process.exit(1)
  })

  process.on('exit', cleanup)
} catch {
  exports.tempDir = { name: '' }
}
