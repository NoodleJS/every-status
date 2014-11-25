'use strict';
var router = require('koa-router');
var bodyParser = require('koa-bodyparser');

module.exports = function(app) {
  var controllers = app.controllers;
  app.use(router(app));

  app.get('/temp', controllers.temp.temp);
}