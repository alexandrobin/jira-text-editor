var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'src');
var ROOT_DIR = path.resolve(__dirname, '');

const CSS_LOADER = ['style-loader', 'css-loader']
const SCSS_LOADER = [...CSS_LOADER, 'sass-loader']

var config = {
  entry: {
    '/': APP_DIR + '/index.js',
  },
  devtool: 'source',
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  cache: true,
  output: {
    path: BUILD_DIR,
    filename: '[name]index.js'
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(path.join(ROOT_DIR, 'vendor.json'))
    })
  ],

  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: APP_DIR,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      { test: /\.css$/,
        use: CSS_LOADER},
        {
            test: /\.scss$/,
            use: SCSS_LOADER,
          },
      {
        test:/\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader:'url-loader'
      },
      {
        test:/\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader:'url-loader'
      }

    ]
  }
};

module.exports = config;
