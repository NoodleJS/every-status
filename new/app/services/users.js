"use strict"

var User = require('../models/user');

exports.getUserById = function(id) {
  
  return User.find({id: id})
    .exec() 
  
}
