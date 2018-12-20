import { resolve } from 'path'
import { DefinePlugin } from 'webpack'

import { argvFlag, runMain } from 'dr-dev/module/main'
import { getLogger } from 'dr-dev/module/logger'
import { compileWithWebpack, commonFlag } from 'dr-dev/module/webpack'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)

runMain(async (logger) => {
  const isModule = Boolean(argvFlag('module'))
  const isExample = Boolean(argvFlag('example'))
  const { mode, isWatch, isProduction, profileOutput, assetMapOutput } = await commonFlag({
    argvFlag,
    fromRoot,
    profileOutput: argvFlag('profile') ? fromRoot(isModule ? '.temp-gitignore/profile-stat.module.json' : '.temp-gitignore/profile-stat.json') : null,
    logger
  })

  const babelOption = {
    configFile: false,
    babelrc: false,
    presets: [
      [ '@babel/env', { targets: !isModule && isProduction ? {} : { node: '10' }, forceAllTransforms: !isModule && isProduction, modules: false } ],
      [ '@babel/react' ]
    ],
    plugins: [
      [ 'babel-plugin-styled-components' ],
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
      'react': 'react',
      'styled-components': 'styled-components'
    },
    resolve: { alias: { source: fromRoot('source') } },
    module: { rules: [ { test: /\.js$/, use: { loader: 'babel-loader', options: babelOption } } ] },
    plugins: [ new DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(mode), __DEV__: !isProduction }) ],
    optimization: { minimize: isExample && isProduction }
  }

  logger.log(`compile with webpack`, JSON.stringify({ isModule, isExample }, null, '  '))
  await compileWithWebpack({ config, isWatch, profileOutput, assetMapOutput, logger })
}, getLogger(`webpack`, argvFlag('quiet')))
