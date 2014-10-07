var Piece = require('../model/piece');
var User = require('../model/user');
var coder = require('../proxy/authorize');


exports.addUser = function(req, res) {
    new User({
        name: 'elrrrrrrr',
        avatar: 'http://tp1.sinaimg.cn/2017654444/50/5635300102/1',
        work: true
    }).save(function(err, it) {
        res.send({
            'code': 200
        })
    })
}

exports.clean = function(req, res) {

    Piece.remove(function() {})
    User.remove(function() {})

    return
}

exports.godModel = function(req, res, cb) {

    //access global model

    User.findOne({
        name: 'Elrrrrrrr'
    }, function(err, user) {

        doLogin(user, req, res);

    })

}



function doLogin(user, req, res) {


    if ('session' in req) {
        (req.session.user = user);
    }
    var token = coder.encodeToken(user._id);

    res.cookie('token', token, {
        maxAge: 3600 * 24 * 7,
        httpOnly: false
    });
    res.redirect('/');

    return
}

exports.showUser = function(req, res) {

}