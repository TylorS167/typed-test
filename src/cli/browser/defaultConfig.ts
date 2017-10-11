import * as path from 'path'

import { tempDir } from '../tempDir'

const cwd = process.cwd()

const HtmlOptions = {
  filename: `index.html`,
  inject: `body`,
  template: path.join(__dirname, '../../../templates', 'index.ejs'),
}

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

export const defaultConfig = {
  entry: {} as Record<string, string>,
  plugins: [
    new HtmlWebpackPlugin(HtmlOptions),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['ts-loader'],
      },
    ],
  },
  resolve: {
    mainFields: ['module', 'jsnext:main', 'browser', 'main'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {} as Record<string, string>,
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'var',
    library: '[name]',
    path: path.join(cwd, tempDir.name),
  },
  target: 'web',
  node: {
    fs: 'empty',
  },
}
