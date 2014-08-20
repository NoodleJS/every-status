var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development'
var setting = {};
var uri = '';

setting = (env == 'development') ? require('../settings.example.json').mongodb : require('../settings.json').mongodb ;

if ( env == 'development' ) {

  uri = 'mongodb://localhost/dev'

} else if ( env == 'production' ) {

  uri = 'mongodb://USER:PASS@HOST:port/DB'.replace('USER', setting.username)
      .replace('PASS',setting.passwd)
      .replace('HOST',setting.host)
      .replace('DB',setting.dbname);
}

var db = mongoose.connect(uri,function(err){
  if (err) console.log(err)
  //console.log('ok')
});

exports = db






