'use strict';
var join = require('path').join;
var loading = require('loading');
var mount = require('koa-mount');

exports.loadController = function(app) {

  loading(join(__dirname, '../app/controllers'))
    .into(app, 'controllers');
  
};

exports.loadRouter = function(app) {

  loading(join(__dirname, '../app/routers'))
    .into(app, 'routers');

  var routers = app.routers;
  //routers.ajax();
  app.use(mount('/', routers.ajax ) );
};

