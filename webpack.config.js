const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/standalone.tsx',
  output: {
    path: path.join(__dirname, 'standalone'),
    filename: 'consent-manager.js',
    library: 'consentManager'
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      // nanoid 6 is ESM-only and exposes the browser build via "exports",
      // which webpack 4 does not resolve. Point standalone at the browser entry.
      nanoid: path.resolve(__dirname, 'node_modules/nanoid/index.browser.js')
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        VERSION: JSON.stringify(pkg.version)
      }
    }),
    new webpack.BannerPlugin(
      `
Consent Manager v${pkg.version}
https://github.com/ht-sdks/consent-manager
Released under the MIT license
Copyright © 2024 Hightouch
    `.trim()
    )
  ]
}
