"use strict"


var mongoose = require('mongoose');
var uri = 'mongodb://localhost/dev';
var User = require('../models/user');

mongoose.connect(uri);



exports.getUserById = function(id) {
  
  return User.find({id: id})
    .exec() 
  
}
