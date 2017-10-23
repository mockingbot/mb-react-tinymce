const nodeModulePath = require('path')
const config = require('./common.conf')

module.exports = {
  ...config,
  entry: { 'index': './source/index' },
  bail: true, // Don't attempt to continue if there are any errors.
  output: {
    path: nodeModulePath.join(__dirname, '../library/'),
    filename: '[name].js',
    library: 'MB_REACT_TINYMCE',
    libraryTarget: 'umd'
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'prop-types': 'prop-types'
  }
}
