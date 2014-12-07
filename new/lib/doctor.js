'use strict';
var koa = require('koa');
var loader = require('./loader');
var mongoose = require('mongoose');

exports.createApp = function(opt) {
  var app = koa();

  app.config = {
    baseDir: opt.base || process.cwd()
  };

  loader.initDb();

  loader.loadController(app);

  loader.loadRouter(app);

  return app;
};