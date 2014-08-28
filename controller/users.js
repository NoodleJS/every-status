var User = require('../model/user');
var wb = require('../proxy/wblogin');

exports.create = function(req, res) {
  new User({
    name: req.body.name,
    avatar: req.body.avatar,
    work: true

  }).save(function(err) {
    if(err) {
      console.log(err)
    }
  })
}

exports.login = function(req, res) {

    if (global.env == 'development' && false) {
        req.session.user = global.God;
    } else {
        var code = req.query.code;
        wb.getToken(code)
            .then(handlerToken)
    }

    function handlerToken(msg) {
        var uid = msg.uid;
        var token = msg.token;
        //resgin or login 
        User.findOne({wbId: uid}, function(err, user) {
            if (err) throw new Error('Error In DB');
            if (user) {
                //login
                doLogin(user);
            } else {
                //regsin
                signUp(token);
            }
        })
    }

    function doLogin(user) {
        req.session.user = user;
        res.redirect('/');
    }

    function signUp(token) {
        wb.getInfo(token)
            .then(addUser)
    }

    //add user by msg from api
    function addUser(msg) {
        new User({
            name: msg.name,
            wbId: msg.id,
            avatar: msg.profile_image_url
        }).save(function(err, user) {
            if (err) throw new Error('Error In addUser'); 
            doLogin(user)
        })
    }     
}

exports.logout = function(req, res) {

    req.session.user = null;
    res.redirect('/');
    
}

