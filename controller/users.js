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
            .then(function(token) {
                var uid = token.uid;
                User.findOne({wbId: uid}, function(err, user) {
                    if (err) console.log(err);
                    if (user) {
                        req.session.user = user;
                    } else {
                        wb.getInfo(token)
                            .then(function(info) {
                                console.log(info);
                                new User({
                                    name: info.name,
                                    wbId: info.id,
                                    avatar: info.profile_image_url
                                }).save(function(err, it){
                                    if (err) console.log(err);
                                    req.session.user = user;
                                    res.redirect('/');    
                                })
                                
                            })
                    }

                })
            })
    }
}

exports.logout = function(req, res) {
    if (global.env == 'development') {
        req.session.user = null;
    }
    res.redirect('/');
}

