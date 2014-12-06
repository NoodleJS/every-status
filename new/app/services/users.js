"use strict"
var User = require('../models/user');

exports.getUserById = function(id) {
  User.findOne({id: id}, function(err, data) {
    

  })
  
}