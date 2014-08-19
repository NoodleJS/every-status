var mongoose = require('mongoose');

var setting = {} ;

try{
  setting = require('../settings.json');
} catch(err){
  
  if(err.code === 'MODULE_NOT_FOUND'){
    setting = require('../settings.example.json');
    }
}


var uri = 'mongodb://USER:PASS@HOST:port/DB'.replace('USER',setting.username)
  .replace('PASS',setting.passwd)
  .replace('HOST',setting.host)
  .replace('DB',setting.dbname);

var db = mongoose.connect(uri,function(err){
  if (err) console.log(err)
  //console.log('ok')
});

exports = db






