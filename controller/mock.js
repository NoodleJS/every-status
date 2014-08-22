var Piece = require('../model/piece');
var User = require('../model/user');

exports.addUser = function(req, res) {
    new User({
        name: 'elrrrrrrr', 
        avatar: 'http://tp1.sinaimg.cn/2017654444/50/5635300102/1', 
        work: true
    }).save(function(err,it) {
        console.log(it)
    })
    res.send({'code':200})
}

