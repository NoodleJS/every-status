var env = process.env.NODE_ENV || 'development';

setting = (env == 'development') ? require('../settings.example.json') : require('../settings.json') ;

module.exports = exports = setting;

