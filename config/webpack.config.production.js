const merge = require('webpack-merge');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const SriPlugin = require('webpack-subresource-integrity');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const { PurifyPlugin } = require('@angular-devkit/build-optimizer');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { reportsPath, rootPath, APP_NAME } = require('./helpers');
const commonConfig = require('./webpack.config.common');

module.exports = merge.smart(commonConfig, {
  mode: 'production',
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: '@angular-devkit/build-optimizer/webpack-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            passes: 2,
          },
          ecma: 5,
        },
      }),
      new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { safe: true, map: { inline: false } } }),
    ],
  },

  plugins: [
    new PurifyPlugin(),

    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      cwd: process.cwd(),
    }),

    new CompressionPlugin({
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024,
    }),

    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
    }),

    new OfflinePlugin({
      autoUpdate: 5 * 60 * 1000,
      AppCache: false,
      externals: ['/', 'home'], // add paths to cache offline here (usually /home or similar)
      excludes: ['_redirects'], // for netlify if used
      ServiceWorker: {
        events: true,
        minify: false,
      },
    }),

    new WebpackPwaManifest({
      name: 'Default App',
      short_name: 'NgxDefault',
      description: 'The Default App',
      background_color: '#ffffff',
      icons: [
        {
          src: rootPath('common', 'assets', 'app.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `${reportsPath(APP_NAME)}/bundle.html`,
      openAnalyzer: false,
    }),
  ],
});
