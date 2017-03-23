if(global.production) return

var browserSync       = require('browser-sync')
var gulp              = require('gulp')
var webpack           = require('webpack')
var webpackMultiConfig = require('../lib/webpack-multi-config')
var config            = require('../config')
var pathToUrl         = require('../lib/pathToUrl')
var proxy = require('http-proxy-middleware')

var browserSyncTask = function() {

  var webpackConfig = webpackMultiConfig('development')
  var compiler = webpack(webpackConfig)
  var proxyConfig = config.tasks.browserSync.proxy || null;

  if (typeof(proxyConfig) === 'string') {
    config.tasks.browserSync.proxy = {
      target : proxyConfig
    }
  }

  var server = config.tasks.browserSync.proxy || config.tasks.browserSync.server;

  var apiProxy = proxy('/api', {
      target: 'http://localhost:9717',
      changeOrigin: true,             
  });

  server.middleware = [
    require('webpack-dev-middleware')(compiler, {
      stats: 'errors-only',
      publicPath: pathToUrl('/', webpackConfig.output.publicPath)
    }),
    require('webpack-hot-middleware')(compiler),
    apiProxy
  ]

  browserSync.init(config.tasks.browserSync)
}

gulp.task('browserSync', browserSyncTask)
module.exports = browserSyncTask
