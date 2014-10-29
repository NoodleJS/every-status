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

    User.findOne({id: id}, function(err, it) {
        
        if (err) throw new Error('Error In DB');
        
        if (it) {
            it.populate('pieces', function(err, set) {

                res.render('user', { title: '今天...', 
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
    
    var type = req.params.type || 'wb'
    if (global.env == 'development' && false) {
        console.log(global.God)
        doLogin(global.God, req, res);

    } else {
        var code = req.query.code;
        //do redir 
        if (code) {
            if (type == 'db') {
                db.getToken(code)
                .then(function(msg) {
                    handlerDb(msg, req, res)
                })
            } else if (type == 'wb') {
                wb.getToken(code)
                    .then(function(msg){
                        handlerWb(msg, req, res)   
                    })      
            }else if(type == 'gt'){
                gt.getToken(code)
                    .then(function(msg){
                        handlerGt(msg, req, res)   
                    })
            }
            
        } else {
            if (type=='wb') {
                var setting = config.wb;
                var query = querystring.stringify({
                    client_id: setting.appkey,
                    redirect_uri: setting.codeUrl,
                    response_type: 'code'
                })
                res.redirect('https://api.weibo.com/oauth2/authorize?'+query);    
            } else if (type=='db'){
                var setting = config.db;
                var query = querystring.stringify({
                    client_id: setting.appkey,
                    redirect_uri: setting.codeUrl,
                    response_type: 'code', 
                })
                res.redirect('https://www.douban.com/service/auth2/auth?'+query);
            } else {
                var setting = config.gt;
                var query = querystring.stringify({
                    client_id: setting.appkey,
                    redirect_uri: setting.codeUrl,
                    scope: 'user,public_repo',
                })
                console.log(query);
                res.redirect('https://github.com/login/oauth/authorize?'+query);
            }
            
        }
    }

    function handlerDb(msg, req, res) {
        var did = msg['douban_user_id'],
            token = msg['access_token'];
        User.findOne({dbId: did}).exec(function(err, user) {
            if (err) throw new Error('Error when find dbuser');
            if (user) {
                doLogin(user, req, res);
            } else {
                dbsignUp(msg, req, res);
            }
        })
    }

    function dbsignUp(msg, req, res) {
        db.getInfo(msg)
            .then(function(msg) {
                addDbUser(msg, req, res)
            });
    }

    function addDbUser(msg) {
        new User({
            name: msg.name,
            dbId: msg.id,
            avatar: msg.avatar
        }).save(function(err, user) {
            if (err) throw new Error('Error In addDbUser'); 
            doLogin(user, req, res)
            
        })
    }  

    function handlerWb(msg, req, res) {
        var uid = msg.uid;
        var token = msg.access_token;
        //resgin or login 
        User.findOne({wbId: uid}, function(err, user) {
            if (err) throw new Error('Error In DB');
            if (user) {
                //login
                user.token = token;
                doLogin(user, req, res);
            } else {
                //regsin
                wbsignUp(msg, req, res);
            }
        })
    }

    function wbsignUp(msg, req, res) {
        wb.getInfo(msg)
            .then(function(msg) {
                addWbUser(msg, req, res)
            })
    }

    //add user by msg from api
    function addWbUser(msg, req, res) {
        new User({
            name: msg.name,
            wbId: msg.id,
            avatar: msg.profile_image_url,
            token: msg.token
        }).save(function(err, user) {
            if (err) throw new Error('Error In addUser'); 
            
            doLogin(user, req, res)
            
        })
    }  

    function handlerGt(msg, req, res) {
        var token = msg.access_token;
        User.findOne({gtToken: token}).exec(function(err, user) {
            if (err) throw new Error('Error when find dbuser');
            if (user) {
                doLogin(user, req, res);
            } else {
                gtsignUp(msg, req, res);
            }
        })
    }

    function gtsignUp(msg, req, res) {
        console.log(msg);
        gt.getInfo(msg)
            .then(function(msg) {
                addGtUser(msg, req, res)
            });
    }

    function addGtUser(msg, req, res) {
        // new User({
        //     name: msg.name,
        //     gtid: msg.id,
        //     avatar: msg.profile_image_url,
        //     gttoken: msg.token
        // }).save(function(err, user) {
        //     if (err) throw new Error('Error In addUser'); 
        //     doLogin(user, req, res) 
        // })
    }  

    function doLogin(user, req, res) {
        
        if ('session' in req) {
            (req.session.user = user);    
        }
        var token = coder.encodeToken(user._id);

        res.cookie('token', token,  { maxAge: 3600 * 24 * 7, httpOnly: false });
        res.redirect('/');
        
        return
    }
 
}

exports.logout = function(req, res) {
    res.clearCookie('token');
    req.session.user = null;
    res.redirect('/');
    
}

function syncUser(user){
    
  console.log(user.favs)

  User.update({name: user.name}, {favs: user.favs}, function(err) {
    console.log(err)
    if (err) throw new Error('error in user ');
  })
}


