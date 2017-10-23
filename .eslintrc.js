module.exports = {
  extends: [ 'standard', 'standard-react' ],
  parser: 'babel-eslint',
  rules: { 'jsx-quotes': [ 2, 'prefer-double' ] },
  globals: { __DEV__: false, tinyMCE: false }
}
