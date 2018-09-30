const path = require('path')
const {
  DllReferencePlugin,
  ProvidePlugin,
} = require('webpack')
const {
  addresses,
} = require('./package.json')

const manifest = require('./vendor.json')

/* Address at which to provide webpack bundle and HMR diff in development */
const WEBPACK_DEV_ADDRESS = addresses.webpack.host
const WEBPACK_DEV_PORT = addresses.webpack.port
const WEBPACK_DEV_PATH = addresses.webpack.path

// NOTE: complete dev address will be "http://{WEBPACK_DEV_ADDRESS}:{WEBPACK_DEV_PORT}{WEBPACK_DEV_PATH}"


/* You can change the base loader "style-loader" to a file extractor in case you want a separate CSS bundle */
const CSS_LOADER = ['style-loader', 'css-loader']
const SCSS_LOADER = [...CSS_LOADER, 'sass-loader']

module.exports = (e) => {
  const env = e || {}

  /* Common parameters */
  const entry = {
    /* Configure your entry points. Each entry point will result in a "build/[name].js" bundle */
    app: './src/index.jsx',
  }

  const output = {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'public/',
  }

  const plugins = [
    new ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types',
      RouterPropTypes: 'react-router-prop-types',
    }),
  ]

  const module = {
    rules: [
      // Inline CSS
      {
        test: /\.css/,
        use: CSS_LOADER,
      },

      // Inline SASS
      {
        test: /\.scss$/,
        use: SCSS_LOADER,
      },

      // Inline fonts in CSS/SCSS files
      {
        test: /\.woff(\?[a-z0-9=.]+)?$/,
        use: ['url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]'],
      },

      {
        test: /\.woff2(\?[a-z0-9=.]+)?$/,
        use: ['url-loader?limit=10000&mimetype=application/font-woff2&name=[name].[ext]'],
      },

      {
        test: /\.svg(\?[a-z0-9#=&.]+)?$/,
        use: ['url-loader?limit=10000&mimetype=image/svg+xml&name=[name].[ext]'],
      },

      {
        test: /\.[ot]tf(\?[a-z0-9=.]+)?$/,
        use: ['url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[ext]'],
      },

      {
        test: /\.eot(\?[a-z0-9=.]+)?$/,
        use: ['url-loader?limit=10000&mimetype=application/vnd.ms-fontobject&name=[name].[ext]'],
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'url-loader?limit=10000',
          'img-loader',
        ],
      },
    ],
  }

  const resolve = {
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      app: path.resolve(__dirname, 'src'),
    },
  }

  const optimization = {}

  let watchOptions = {}

  let devServer = {}


  if (env && env.production) {
    /* Production specific configuration */

    /* Modify any configuration object here for production specific cases */

    /* Add your Webpack plugins here */
    plugins.push(new DllReferencePlugin({
      context: process.cwd(),
      manifest,
    }))

    /* Add rule for JSX without HMR in production */
    module.rules.push({
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
      }],
    })
  } else {
    /* Development specific configuration */

    /* Modify any configuration object here for development specific cases */

    /* In development, we watch the files */
    watchOptions = {
      aggregateTimeout: 500,
      poll: 500,
      ignored: /node_modules/,
    }

    /* In development, we use a development server for hot reloading */
    devServer = {
      proxy: {
        '/public/*': {
          target: `http://0.0.0.0:${WEBPACK_DEV_PORT}/`,
          pathRewrite: {
            '^/public': '',
          },
        },
      },
      contentBase: './build',
      host: '0.0.0.0',
      port: WEBPACK_DEV_PORT,
      disableHostCheck: true,
      overlay: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }

    /* Add rule for JSX with HMR in development */
    module.rules.push({
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'react-hot-loader/babel',
            ],
            [
              'react-transform',
              {
                transforms: [{
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                }],
              },
            ],
          ],
        },
      }],
    })
  }

  /* Return the configured object */
  return {
    entry,
    output,
    resolve,
    plugins,
    module,
    optimization,
    watchOptions,
    devServer,
  }
}
