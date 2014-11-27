'use strict';
var Router = require('koa-router');

module.exports = function(controllers) {
  
  var router = new Router();
  router.get('/', controllers.temp.temp);  
  return router.middleware();  
}
