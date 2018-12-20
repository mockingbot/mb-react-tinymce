const BABEL_ENV = process.env.BABEL_ENV || ''
const isDev = BABEL_ENV.includes('dev')
const isModule = BABEL_ENV.includes('module')

module.exports = {
  presets: [
    [ '@babel/env', {
      targets: isDev ? { node: '10' } : {},
      forceAllTransforms: !isDev,
      modules: isModule ? false : 'commonjs'
    } ],
    [ '@babel/react' ]
  ],
  plugins: [
    [ 'babel-plugin-styled-components' ],
    [ '@babel/plugin-proposal-class-properties', { loose: true } ],
    [ 'minify-replace', { replacements: [ { identifierName: '__DEV__', replacement: { type: 'booleanLiteral', value: isDev } } ] } ],
    [ 'module-resolver', {
      root: [ './' ],
      alias: isModule ? undefined : {
        'dr-dev/module/(.+)': 'dr-dev/library/',
        'dr-js/module/(.+)': 'dr-js/library/'
      }
    } ]
  ].filter(Boolean),
  comments: false
}
