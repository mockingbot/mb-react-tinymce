import { resolve } from 'path'
import { DefinePlugin } from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import PostCSSCSSNext from 'postcss-cssnext'

import { argvFlag, runMain } from 'dev-dep-tool/library/__utils__'
import { compileWithWebpack } from 'dev-dep-tool/library/webpack'
import { getLogger } from 'dev-dep-tool/library/logger'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)

runMain(async (logger) => {
  const mode = argvFlag('development', 'production') || 'production'
  const isProduction = mode === 'production'
  const isWatch = Boolean(argvFlag('watch'))
  const isModule = Boolean(argvFlag('module'))
  const isExample = Boolean(argvFlag('example'))
  const profileOutput = argvFlag('profile') ? fromRoot(isModule ? 'profile-stat-module-gitignore.json' : 'profile-stat-library-gitignore.json') : null

  const babelOption = {
    babelrc: false,
    cacheDirectory: isProduction,
    presets: [ [ '@babel/env', { targets: isModule ? { node: 8 } : '> 1%, last 2 versions', modules: false } ], [ '@babel/react' ] ],
    plugins: [ [ '@babel/proposal-class-properties' ], [ '@babel/proposal-object-rest-spread', { useBuiltIns: true } ] ]
  }
  const cssOption = { importLoaders: 1, localIdentName: isProduction ? '[hash:base64:12]' : '[name]_[local]_[hash:base64:5]' }
  const postcssOption = { plugins: () => [ PostCSSCSSNext ] }

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
        { test: /\.js$/, exclude: /node_modules/, use: [ { loader: 'babel-loader', options: babelOption } ] },
        { test: /\.css$/, use: ExtractTextPlugin.extract({ use: [ { loader: 'css-loader' } ] }) },
        {
          test: /\.pcss$/,
          use: ExtractTextPlugin.extract({
            use: [
              { loader: 'css-loader', options: cssOption },
              { loader: 'postcss-loader', options: postcssOption }
            ]
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('index.css'),
      new DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(mode), '__DEV__': !isProduction })
    ],
    optimization: { minimize: false }
  }

  logger.log(`compile with webpack`, JSON.stringify({ mode, isProduction, isWatch, isModule, isExample }, null, '  '))
  await compileWithWebpack({ config, isWatch, profileOutput, logger })
}, getLogger(`webpack`))
