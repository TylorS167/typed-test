import * as rimraf from 'rimraf'
import * as tmp from 'tmp'

export const tempDir = tmp.dirSync({ template: '.typed-test-XXXXXX' })

process.on('exit', () => {
  rimraf.sync(tempDir.name)
})
