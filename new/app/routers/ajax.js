'use strict';
var Router = require('koa-router');

module.exports = function(controllers) {
  
  var router = new Router();
  
  router.get('/:id', controllers.temp.getUser);
  return router.middleware();  
}
