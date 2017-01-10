/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0*/
/* eslint global-require: 0*/
import path from 'path'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import sfs from 'session-file-store'
import config from './config'

const Promise = require('bluebird')
const mongoose = require('mongoose')
const routes = require('./routes/index')

// Express will set the NODE_ENV to 'development' if you dont config it, but
// koa is not.
const FileStore = sfs(session)

mongoose.Promise = Promise;


const port = process.env.PORT ? process.env.PORT : config.port
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack')
  const webpackConfig = require('../webpack/webpack.config.js')

  const compiler = webpack(webpackConfig)
  const middleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })

  app.use(middleware)
  const hotMiddleware = require('webpack-hot-middleware')(compiler)
  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })
  app.use(hotMiddleware)
}


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(session({
  store: new FileStore(),
  secret: 'express-dwb',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))
app.use(express.static('dist'))
app.use('/', routes);


mongoose.connect(config.mongoUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  app.listen(port, config.host, (err) => {
    if (err) {
      console.log(err)
    }
    console.info(`==> 🌎 Listening on port ${port}. Open up http://${config.host}:${port}/ in your browser.`)
  })
})
