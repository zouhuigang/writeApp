var fs = require('fs')
var path = require('path')

var pinyinPath = path.resolve('./gulpfile.js/lib/pinyin.json')
var obj = JSON.parse(fs.readFileSync(pinyinPath, 'utf8'));

var newObj = {};
var keys = [], len, k, i;

for (var k in obj){
  if(obj.hasOwnProperty(k)) {
    keys.push(k);
  }
}

keys.sort();
len = keys.length;

for(i = 0; i < len; i++) {
  k = keys[i];
  newObj[k] = obj[k];
}
module.exports = newObj;
