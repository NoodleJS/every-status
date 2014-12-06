'use strict';
var ser = require('../services/users');

exports.temp = function *temp() {
  this.body = 'hello koa';
}

exports.getUser = function *temp() {
  var id = this.params.id;
  this.body = yield ser.getUserById(id);
}