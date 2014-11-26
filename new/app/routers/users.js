'use strict';
var Router = require('koa-router');

var router = new Router();

module.exports = function* (app) {

  var controllers = app.controllers;

  router.get('/', controllers.temp.temp);

  return router.middleware();
}