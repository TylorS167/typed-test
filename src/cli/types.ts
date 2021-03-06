export type ParsedArgs = {
  _: Array<string>
  browser: boolean
  requires: string | Array<string>
  help: boolean
  timeout: string
  config: string
  keepAlive: boolean
  coverage: boolean
}
