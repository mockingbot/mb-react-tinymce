const nodeModulePath = require('path')
const config = require('./common.conf')

module.exports = Object.assign(config, {
  entry: { 'index': './source/index.example' },
  output: {
    path: nodeModulePath.join(__dirname, '../example/'),
    filename: '[name].js',
    library: 'MB_REACT_TINYMCE',
    libraryTarget: 'umd'
  }
})
