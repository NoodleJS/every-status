var querystring = require('querystring');
var User = require('../model/user');
var Piece = require('../model/piece');
var wb = require('../proxy/wblogin');
var db = require('../proxy/doubanlogin');
var gt = require('../proxy/githublogin');
var coder = require('../proxy/authorize');
var config = require('../proxy/getconfig');
var Q = require('q');

exports.show = function(req, res) {

  var user = req.session.user || {};
  var id = req.params.id;

  User.findOne({
    id: id
  }, function(err, it) {
    if (err) throw new Error('Error In DB');
    if (it) {
      it.populate('pieces', function(err, set) {

        res.render('user', {
          title: '今天...',
          name: 'people',
          user: req.session.user,
          tuser: set,
          current: user,
          pages: 1,
          index: 1,
          favs: set.pieces
        })
      })
    } else {
      res.redirect('/')
    }
  })
}

//登录 更新token
exports.login = function(req, res) {

  var type = req.params.type;

  if (!type) {
    res.redirect('/');
  }

  var code = req.query.code;
  //do redir 
  if (code) {
    if (type == 'db') {
      db.getToken(code)
        .then(handlerDb(req, res))
    } else if (type == 'wb') {
      wb.getToken(code)
        .then(handlerWb(req, res))
    } else if (type == 'gt') {
      gt.getToken(code)
        .then(handlerGt(req, res))
    }

  } else {
    if (type == 'wb') {
      var setting = config.wb;
      var query = querystring.stringify({
        client_id: setting.appkey,
        redirect_uri: setting.codeUrl,
        response_type: 'code'
      })
      res.redirect('https://api.weibo.com/oauth2/authorize?' + query);
    } else if (type == 'db') {
      var setting = config.db;
      var query = querystring.stringify({
        client_id: setting.appkey,
        redirect_uri: setting.codeUrl,
        response_type: 'code',
      })
      res.redirect('https://www.douban.com/service/auth2/auth?' + query);
    } else {
      var setting = config.gt;
      var query = querystring.stringify({
        client_id: setting.appkey,
        redirect_uri: setting.codeUrl,
        scope: 'user,public_repo',
      })
      res.redirect('https://github.com/login/oauth/authorize?' + query);
    }

  }


  function handlerDb(req, res) {

    return function(msg) {

      var dbId = msg.douban_user_id,
        token = msg.access_token;

      User.findOne({
        dbId: dbId
      }).exec(function(err, user) {
        if (err) throw new Error('Error when find dbuser');

        // if ( 'user' in req.session) {
        //     //update code
        //     var user = req.session.user;
        //     User.findOne({id: user.id})
        //         .then(updateInfo)
        //         .then(mergeAccount)
        //         .end();

        //     function updateInfo(user) {

        //     }

        //     function mergeAccount() {

        //     }
        //     //do merge 

        //     return ;
        // }
        if (user) {
          //login
          if (user.dbToken && user.dbToken == token) {
            doLogin(user, req, res);
          } else {
            user.dbToken = token;
            user.save(function(err, it) {
              doLogin(it, req, res);
            })
          }
        } else {
          dbsignUp(msg, token, req, res);
        }
      })
    }

  }

  function dbsignUp(msg, token, req, res) {
    db.getInfo(msg)
      .then(function(msg) {
        addDbUser(msg, token, req, res)
      });
  }

  function addDbUser(msg, token, req, res) {
    if ('name' in msg) {
      new User({
        name: msg.name,
        dbId: msg.id,
        avatar: msg.avatar,
        dbToken: token
      }).save(function(err, user) {
        if (err) throw new Error('Error In addDbUser');
        doLogin(user, req, res)

      })
    } else {
      res.redirect('/');
    }
  }

  function handlerWb(req, res) {

    //resgin or login 

    return function(msg) {

      var uid = msg.uid;
      var token = msg.access_token;

      User.findOne({
        wbId: uid
      }, function(err, user) {
        if (err) throw new Error('Error In DB');
        if (user) {
          //login
          if (user.wbToken && user.wbToken == token) {
            doLogin(user, req, res);
          } else {
            user.wbToken = token;
            user.save(function(err, it) {
              doLogin(it, req, res);
            })
          }
        } else {
          //regsin
          wbsignUp(msg, token, req, res);
        }
      })
    }

  }

  function wbsignUp(msg, req, res) {
    wb.getInfo(msg)
      .then(function(msg) {
        addWbUser(msg, req, res)
      })
  }

  //add user by msg from api
  function addWbUser(msg, token, req, res) {
    if ('name' in msg) {
      new User({
        name: msg.name,
        wbId: msg.id,
        avatar: msg.profile_image_url,
        token: token
      }).save(function(err, user) {
        if (err) throw new Error('Error In addUser');

        doLogin(user, req, res)

      })
    } else {
      res.redirect('/');
    }
  }

  function handlerGt(req, res) {
    //parse parm


    return function(msg) {
      var token = querystring.parse(msg).access_token;

      User.findOne({
        gtToken: token
      }).exec(function(err, user) {
        if (err) throw new Error('Error when find dbuser');
        if (user) {
          //login
          if (user.gtToken && user.gtToken == token) {
            doLogin(user, req, res);
          } else {
            user.gtToken = token;
            user.save(function(err, it) {
              doLogin(it, req, res);
            })
          }
        } else {
          gtsignUp(msg, token, req, res);
        }
      })
    }
  }

  function gtsignUp(msg, req, res) {
    gt.getInfo(msg)
      .then(function(msg) {
        addGtUser(msg, req, res)
      });
  }

  function addGtUser(msg, token, req, res) {
    if ('login' in msg) {
      new User({
        name: msg.login,
        gtId: msg.id,
        avatar: msg.avatar_url,
        gtToken: token
      }).save(function(err, user) {
        if (err) throw new Error('Error In addUser');
        doLogin(user, req, res)
      })
    } else {
      res.redirect('/');
    }
  }

  function doLogin(user, req, res) {

    if ('session' in req && '_id' in user) {
      (req.session.user = user);
      var token = coder.encodeToken(user._id);
      res.cookie('token', token, {
        maxAge: 3600 * 24 * 7,
        httpOnly: false
      });
    }

    res.redirect('/');
    return
  }

}

exports.logout = function(req, res) {
  res.clearCookie('token');
  req.session.user = null;
  res.redirect('/');

}

function syncUser(user, cb) {

  User.update({
    name: user.name
  }, {
    favs: user.favs
  }, function(err) {
    console.log(err)
    if (err) throw new Error('error in user ');
    cb && cb();
  })
}