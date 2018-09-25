const BABEL_ENV = process.env.BABEL_ENV || ''
const isDev = BABEL_ENV.includes('dev')
const isModule = BABEL_ENV.includes('module')

module.exports = {
  presets: [
    [ '@babel/env', { targets: isDev ? { node: '8.8' } : {}, forceAllTransforms: !isDev, modules: isModule ? false : 'commonjs' } ],
    [ '@babel/react' ]
  ],
  plugins: [
    [ '@babel/plugin-proposal-class-properties', { loose: true } ],
    !isModule && [ '@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true } ], // NOTE: for Edge(17.17134) support check: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals
    [ 'module-resolver', { root: [ './' ], alias: isModule ? undefined : { 'dr-js/module/(.+)': 'dr-js/library/' } } ],
    [ 'minify-replace', { replacements: [ { identifierName: '__DEV__', replacement: { type: 'booleanLiteral', value: isDev } } ] } ]
  ].filter(Boolean),
  comments: false
}
