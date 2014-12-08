'use strict';
var Router = require('koa-router');

module.exports = function(controllers) {
  
  var router = new Router();
  router.get('/', controllers.index.show);  
  return router.middleware();  
}
