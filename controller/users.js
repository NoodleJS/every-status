var User = require('../model/user');

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
    if (global.env == 'development') {
        req.session.user = global.God;
    } else {
        //validate
        //req.session.user = req.body.user
    }
    res.redirect('/');
}

exports.logout = function(req, res) {
    if (global.env == 'development') {
        req.session.user = null;
    }
    res.redirect('/');
}

