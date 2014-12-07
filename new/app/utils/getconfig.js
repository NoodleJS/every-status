var env = process.env.NODE_ENV || 'development' ;

var settings = ( env == 'production' ) ? 
  require('../../config/config.json'):
  require('../../config/config.default.json');

module.exports = exports = settings;