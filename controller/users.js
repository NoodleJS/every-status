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

        var q = wb.getToken(code);

        q.then(function(token){
            
            res.render('console',{
                message: 'test token',
                content: token
            })    
        })
        
        //validate
        //req.session.user = req.body.user
    }
    //res.redirect('/');
}

exports.logout = function(req, res) {
    if (global.env == 'development') {
        req.session.user = null;
    }
    res.redirect('/');
}

