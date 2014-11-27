'use strict';
var join = require('path').join;
var loading = require('loading');
var mount = require('koa-mount');

exports.loadController = function(app) {

  loading(join(__dirname, '../app/controllers'))
    .into(app, 'controllers');
  
};

exports.loadRouter = function(app) {

  loading(join(__dirname, '../app/routers'), {call: false})
    .into(app, 'routers');

  var routers = app.routers;
  var controllers = app.controllers;

  Object.keys(routers).forEach(function (e) {
    app.use(mount('/'+e, routers[e](controllers)));
  })
  
};

