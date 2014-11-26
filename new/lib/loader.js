'use strict';
var join = require('path').join;
var loading = require('loading');
var mount = require('koa-mount');
var routerEntry = require('../config/router');

exports.loadController = function(app) {

  loading(join(__dirname,'../app/controllers'))
    .into(app, 'controllers');
  
};

exports.loadRouter = function(app) {
  app.use(mount('/', routerEntry.middleware()));
};