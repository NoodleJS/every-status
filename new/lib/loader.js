'use strict';
var join = require('path').join;
var loading = require('loading');
var mount = require('koa-mount');
var serve = require('koa-static');
var mongoose = require('mongoose');
var views = require('koa-views');

var settings = require('../app/utils/getconfig');


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

exports.loadStatic = function(app) {
  
  app.use(serve(__dirname + '/../app/assets'));
}

exports.initViews = function(app) {

  app.use(views(__dirname + '/../app/views', {
    default: 'jade'
  }));
}

exports.initDb = function() { 
  var _settings = settings.mongodb;
  var uri = "mongodb://HOST/DBNAME"
    .replace('HOST', _settings.host)
    .replace('DBNAME', _settings.dbname);

  mongoose.connect(uri, function(err, data) {
    if (err) {
      console.log(err);
      throw Error('ERROR IN CONNECT DB');
    }
  })

}