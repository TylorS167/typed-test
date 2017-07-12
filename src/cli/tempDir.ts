import * as tmp from 'tmp'

export const tempDir = tmp.dirSync({ template: '.typed-test-XXXXXX' })
