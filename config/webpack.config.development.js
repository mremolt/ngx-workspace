const merge = require('webpack-merge');
const { EnvironmentPlugin, HotModuleReplacementPlugin } = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const commonConfig = require('./webpack.config.common');

module.exports = merge.smart(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true,
    }),
    new FriendlyErrorsWebpackPlugin(),
    new HotModuleReplacementPlugin(),
  ],

  devServer: {
    historyApiFallback: true,
    quiet: true,
    hot: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    host: '0.0.0.0',
    port: 3000,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
});
