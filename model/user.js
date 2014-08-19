var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    name: String,
    avatar: String,
    //author: Objectid ,
    work: Boolean,
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }

})

var User = mongoose.model('User', userSchema);

module.exports = User