'use strict';
var ser = require('../services/users');

exports.show = function *temp() {

  yield this.render('index');
}