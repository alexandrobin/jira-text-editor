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
// const {
//   default: query,
// } = require('./persistence/query')

// Require package.json for configuration
const {
  addresses,
} = require('../package.json')


const persistence = new Persistence({
    models,
}) /* query et mutation optionnels */
persistence.connect({
    endpoint: 'mongodb://127.0.0.1:27017/jira-text-editor-persistence',
})

Server.init({
  addresses,
  persistence: persistence,
  auth: {
    secret: 'dazzled-jwt-secret-key-odnswid',
    async validate() {
      return true
    },
  },
  web: {
    rootDir: path.resolve(__dirname, '../public'),
    viewDir: path.resolve(__dirname, './views'),
    useStatic: process.env.NODE_ENV === 'production', // In development, static files are handled by WebPack
    views: [{
      view: 'index',
      path: '/{path*}',
    },
    ],
  },
  graphql: {
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
            account: {
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
