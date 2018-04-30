require('ts-node/register');
require('tsconfig-paths/register');

const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  ContextReplacementPlugin,
  EnvironmentPlugin,
  NormalModuleReplacementPlugin,
  ProgressPlugin,
} = require('webpack');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const { rootPath, appPath, distPath, libPath, libs, APP_NAME, appRelative, libsRelative } = require('./helpers');

const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_ENV = process.env.APP_ENV || NODE_ENV;

const workspaceRoot = rootPath();
const appRoot = appPath(APP_NAME);
const distRoot = distPath(APP_NAME);

const ENVIRONMENT = require(appPath(APP_NAME, 'src', 'environments', APP_ENV)).settings;

const cssLoader = [
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: () => {
        return [require('autoprefixer')];
      },
    },
  },
  { loader: 'sass-loader', options: { sourceMap: true } },
];

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    // mainFields: ['esm5', 'module', 'main', 'browser'],
    // alias: {
    //   ...pathMapping(),
    // },
  },

  entry: {
    polyfills: rootPath('common', 'polyfills.ts'),
    main: [`${appRoot}/src/main.ts`, `${appRoot}/src/styles/application.scss`],
  },

  output: {
    filename: '[name].[hash].js',
    path: distPath(APP_NAME),
    crossOriginLoading: 'use-credentials',
  },

  performance: { hints: false },

  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack',
      },

      {
        test: /\.js$/,
        parser: {
          system: true, // no warning from angular packages
        },
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        // include: [appRelative(APP_NAME, 'src', 'app'), ...libsRelative()],
      },
      { test: /\.css$/, use: 'raw-loader' },
      {
        test: /\.(scss)$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { sourceMap: true } }, ...cssLoader],
        // include: [appRelative(APP_NAME, 'src', 'styles')],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin([path.join('dist', APP_NAME), path.join('reports', APP_NAME), path.join('docs', APP_NAME)], {
      root: rootPath(),
    }),
    new ProgressPlugin(),

    new ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)esm5/, path.join(__dirname, './client')),

    new AngularCompilerPlugin({
      tsConfigPath: `${appRoot}/tsconfig.json`,
      entryModule: `${appRoot}/src/app/app.module#AppModule`,
      sourceMap: true,
      compilerOptions: { module: 'esnext' },
    }),

    new EnvironmentPlugin({
      APP_ENV,
      NODE_ENV,
    }),

    new HtmlWebpackPlugin({
      template: `${appRoot}/src/index.ejs`,
      environment: ENVIRONMENT,
      chunks: ['polyfills', 'main'],
      chunksSortMode: 'manual',
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};
