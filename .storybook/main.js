const path = require('path')

module.exports = {
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  core: {
    disableTelemetry: true
  },
  stories: ['../stories/**/*.stories.tsx'],
  // Serve the standalone bundle for iframe stories (replaces `start-storybook -s ./`).
  staticDirs: [{ from: '../standalone', to: '/standalone' }],
  // Existing stories use storiesOf, which needs the v6 store.
  features: {
    storyStoreV7: false
  },
  babel: async options => ({
    ...options,
    presets: [
      require.resolve('@babel/preset-env'),
      [require.resolve('@babel/preset-react'), { runtime: 'classic' }],
      require.resolve('@babel/preset-typescript')
    ]
  }),
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.html$/,
      include: path.resolve(__dirname, '../stories'),
      type: 'asset/source'
    })

    return config
  }
}
