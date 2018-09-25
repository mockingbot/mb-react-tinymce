import { resolve } from 'path'
import { DefinePlugin } from 'webpack'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import PostCSSCSSNext from 'postcss-cssnext'

import { argvFlag, runMain } from 'dev-dep-tool/library/main'
import { getLogger } from 'dev-dep-tool/library/logger'
import { compileWithWebpack, commonFlag } from 'dev-dep-tool/library/webpack'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)

runMain(async (logger) => {
  const isModule = Boolean(argvFlag('module'))
  const isExample = Boolean(argvFlag('example'))
  const { mode, isWatch, isProduction, profileOutput, assetMapOutput } = await commonFlag({
    profileOutput: argvFlag('profile') ? fromRoot(isModule ? '.temp-gitignore/profile-stat.module.json' : '.temp-gitignore/profile-stat.json') : null,
    argvFlag,
    fromRoot,
    logger
  })

  const babelOption = {
    configFile: false,
    babelrc: false,
    cacheDirectory: isProduction,
    presets: [
      [ '@babel/env', { targets: isModule ? {} : { node: '8.8' }, forceAllTransforms: isModule, modules: false } ],
      [ '@babel/react' ]
    ],
    plugins: [
      [ '@babel/plugin-proposal-class-properties', { loose: true } ],
      isProduction && [ '@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true } ] // NOTE: for Edge(17.17134) support check: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals
    ].filter(Boolean)
  }

  const config = {
    mode,
    bail: isProduction,
    output: {
      path: isExample ? fromRoot('example') : fromOutput(isModule ? 'module' : 'library'),
      filename: '[name].js',
      library: 'MB_REACT_TINYMCE',
      libraryTarget: 'umd'
    },
    entry: {
      'index': isExample
        ? 'source/index.example'
        : 'source/index'
    },
    externals: isExample ? undefined : {
      'prop-types': 'prop-types',
      'react': 'react'
    },
    resolve: { alias: { source: fromRoot('source') } },
    module: {
      rules: [
        { test: /\.js$/, use: [ { loader: 'babel-loader', options: babelOption } ] },
        { test: /\.css$/, use: [ MiniCssExtractPlugin.loader, { loader: 'css-loader' } ] },
        {
          test: /\.pcss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1, localIdentName: isProduction ? '[hash:base64:12]' : '[name]_[local]_[hash:base64:5]' } },
            { loader: 'postcss-loader', options: { plugins: () => [ PostCSSCSSNext ] } }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: 'index.css' }),
      new DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(mode), __DEV__: !isProduction })
    ],
    optimization: { minimize: false }
  }

  logger.log(`compile with webpack`, JSON.stringify({ mode, isProduction, isWatch, isModule, isExample }, null, '  '))
  await compileWithWebpack({ config, isWatch, profileOutput, assetMapOutput, logger })
}, getLogger(`webpack`))
