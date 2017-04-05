var config   = require('../config')
var express  = require('express')
var gulp     = require('gulp')
var path     = require('path')
var fs = require('fs');
var pinyin = require('../lib/pinyin');


var expressTask = function() {
  
  // var pressure = require('./d3/index');

  var app = express();
  app.listen(9717);

  var dataDir = config.root.data;
  // var pressure = pressure;

  //获取单个汉字的xml数据
  app.get('/api/getCharxml/:name', function(req, res) {
    fs.readFile(dataDir + '/freq3000/' + req.params.name + '.xml', 'utf8', function(err, data) {

      res.set('Content-Type', 'text/xml')
      res.end(data);
    })
    // res.end(req.params.name)
  });
  app.get('/api/getCharJson/:name', function(req, res) {
    fs.readFile(dataDir + '/json/' + req.params.name + '.json', 'utf8', function(err, data) {
      res.end(data);
    })
  });
  app.get('/api/getFormatedChar/:name', function(req, res) {
    fs.readFile(dataDir + '')
  });
  app.get('/api/pinyin', function(req, res) {
    res.json(pinyin);
  });
}

gulp.task('express', expressTask)

module.exports = expressTask
