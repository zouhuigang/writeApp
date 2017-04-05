var config = require('../config')
if(!config.tasks.js) return

var path            = require('path')
var pathToUrl       = require('./pathToUrl')
var webpack         = require('webpack')
var webpackManifest = require('./webpackManifest')

module.exports = function(env) {
  // path.resolve('./src', 'javascripts')
  var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
  // path.resolve('./dest', 'javascripts')
  var jsDest = path.resolve(config.root.dest, config.tasks.js.dest)
  // 
  var publicPath = pathToUrl(config.tasks.js.dest, '/')
  // 设置webpack的resolve: {extensions: [???, ??]}
  var extensions = config.tasks.js.extensions.map(function(extension) {
    return '.' + extension
  })
  // revision，版本号
  var rev = config.tasks.production.rev && env === 'production'
  var filenamePattern = rev ? '[name]-[hash].js' : '[name].js'

  var webpackConfig = {
    // 指向的默认目录
    context: jsSrc,
    plugins: [],

    resolve: {
      // 包含模块的目录
      root: [
        jsSrc, 
        path.resolve('./node_modules/materialize-css/dist/js'),
        // path.resolve('./node_modules/material-components-web')
      ],
      // 模块的后缀名
      extensions: [''].concat(extensions)
    },
    module: {
      loaders: [
        {
          // 必须满足的条件
          test: /\.js|jsx$/,
          loader: 'babel-loader',
          // 不满足的条件
          // exclude: /node_modules/,
          query: config.tasks.js.babel
        }
      ]
    }
  }

  if(env === 'development') {
    webpackConfig.devtool = 'inline-source-map'
    console.log("development")
    // Create new entries object with webpack-hot-middleware added
    for (var key in config.tasks.js.entries) {
      var entry = config.tasks.js.entries[key]
      config.tasks.js.entries[key] = ['webpack-hot-middleware/client?&reload=true'].concat(entry)
    }

    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if(env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = config.tasks.js.entries

    webpackConfig.output= {
      path: path.normalize(jsDest),
      filename: filenamePattern,
      publicPath: publicPath
    }

    if(config.tasks.js.extractSharedJs) {
      // Factor out common dependencies into a shared.js
      webpackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'shared',
          filename: filenamePattern,
        })
      )
    }
  }

  if(env === 'production') {
    if(rev) {
      webpackConfig.plugins.push(new webpackManifest(publicPath, config.root.dest))
    }
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.NoErrorsPlugin()
    )
  }

  return webpackConfig
}
