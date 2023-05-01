import path from 'path'
import WebpackAssetsManifest from 'webpack-assets-manifest'

import { babel } from './loaders/babel'
import { theme, route, local } from '../config'

const config = ({ isProd }) => ({
  mode: isProd ? 'production' : 'development',
  entry: path.resolve(route.src, './assets/js/index.js'),
  output: {
    globalObject: theme,
    path: path.resolve(route.dist, './js/'),
    publicPath: `${!isProd ? local : ''}/wp-content/themes/${theme}/js/`,
    filename: '[id].[contenthash].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  module: {
    rules: [
      babel
    ]
  },
  plugins: [
    new WebpackAssetsManifest()
  ],
  devtool: 'source-map'
})

export {
  config
}
