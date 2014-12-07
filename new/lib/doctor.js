'use strict';
var koa = require('koa');
var loader = require('./loader');
var mongoose = require('mongoose');

//init db

exports.createApp = function(opt) {
  var app = koa();

  app.config = {
    baseDir: opt.base || process.cwd()
  };

  loader.loadController(app);

  loader.loadRouter(app);

  loader.initDb();

  return app;
};