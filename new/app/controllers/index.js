'use strict';
var ser = require('../services/users');

exports.show = function *temp() {
  this.body = 'hello koa';
  this.render()
}
