/* Perform babel transforms defined in .babelrc (ES6, JSX, etc.) on server-side code
   Note: the options in .babelrc are also used for client-side code
   because we use a babel loader in webpack config */

require('babel-register')
require('babel-polyfill')

const path = require('path')
const url = require('url')

const Server = require('@dazzled/framework-server')
const Persistence = require('@dazzled/framework-persistence')

// Get models
const {
  default: models,
} = require('./persistence/models')
const {
  default: query,
} = require('./persistence/query')

// Require package.json for configuration
const {
  addresses,
} = require('../package.json')


const persistence = new Persistence({
  models, query: query('dazzled-jwt-secret-key-odnswid'),
}) /* query et mutation optionnels */
persistence.connect({
  endpoint: 'mongodb://127.0.0.1:27017/jira-text-editor-persistence',
})

const server = new Server()
server.init({
  addresses,
  persistence,
  auth: {
    secret: 'dazzled-jwt-secret-key-odnswid',
    async validate() {
      return true
    },
  },
  web: {
    views: {
      dir: path.resolve(__dirname, './views'),
      paths: {
        '/{path*}': 'index',
      },
    },
    static: {
      dir: path.resolve(__dirname, '../build'),
      path: '/public',
      enabled: process.env.NODE_ENV === 'production',
    },
  },
  graphql: {
    enableGraphiQL: (process.env.NODE_ENV === 'development'),
    schema: persistence.schema,
    graphql: '/graphql',
    graphiql: '/graphiql',
    graphqlOptions(schema) {
      return async (req) => {
        const referer = new url.URL(req.headers.referer)

        let _id = req.auth.credentials ? req.auth.credentials.id : null
        if (referer.pathname.startsWith('/graphiql') && referer.searchParams.get('user')) {
          _id = referer.searchParams.get('user')
        }

        return ({
          schema,
          context: {
            auth: req.auth,
            user: {
              _id,
            },
          },
        })
      }
    },
  },
})

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})
