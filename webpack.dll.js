var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/dll');
var ROOT_DIR = path.resolve(__dirname, '');

module.exports = {
  context: process.cwd(),

  entry: {
    vendor:[
      'react',
      'react-dom'
    ]
  },

 output: {
    filename: '[name].js',
    path: BUILD_DIR,
    library: '[name]',
  },

  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(ROOT_DIR, '[name].json')
    })
  ]
};
