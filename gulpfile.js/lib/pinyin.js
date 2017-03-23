var fs = require('fs')
var obj = JSON.parse(fs.readFileSync('pinyin.json', 'utf8'));

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
