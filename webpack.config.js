const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const pkg = require('./package.json')

module.exports = {
  mode: 'production',
  // Keep the standalone bundle ES5-compatible for older browsers (webpack 5 defaults to ES6 runtime).
  target: ['web', 'es5'],
  devtool: 'source-map',
  entry: './src/standalone.tsx',
  output: {
    path: path.join(__dirname, 'standalone'),
    filename: 'consent-manager.js',
    library: {
      name: 'consentManager',
      type: 'var'
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // Keep the BannerPlugin comment in the JS file (webpack 5 would otherwise extract it).
        extractComments: false
      })
    ]
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
        use: 'ts-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(pkg.version)
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
