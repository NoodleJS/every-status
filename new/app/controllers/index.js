'use strict';
var ser = require('../services/users');

exports.show = function *temp() {
  console.log(this.render)
  this.body = this.render;
}