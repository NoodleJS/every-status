var querystring = require('querystring');
var User = require('../model/user');
var Piece = require('../model/piece');
var wb = require('../proxy/wblogin');
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

exports.login = function(req, res) {
    
    var type = req.params.type || 'wb'
    if (global.env == 'development' && false) {
        doLogin(global.God);
    } else {
        var code = req.query.code;
        //do redir 
        
        if (code) {
            if (type == 'db') {
                wb.getToken(code, type)
                .then(function(msg) {
                    handlerDb(msg, req, res)
                })
            } else if (type == 'wb') {
                wb.getToken(code, type)
                    .then(function(msg){
                        
                        handlerToken(msg, req, res)   
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
            } else {
                
                var setting = config.db;
                var query = querystring.stringify({
                    client_id: setting.appkey,
                    redirect_uri: setting.codeUrl,
                    response_type: 'code', 
                })
                res.redirect('https://www.douban.com/service/auth2/auth?'+query);
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
        wb.getDbInfo(msg)
            .then(function(msg) {
                addDbUser(msg, req, res)
            });
    }


    function handlerToken(msg, req, res) {
        
        var uid = msg.uid;
        var token = msg.token;
        //resgin or login 
        User.findOne({wbId: uid}, function(err, user) {
            if (err) throw new Error('Error In DB');
            if (user) {
                //login
                doLogin(user, req, res);
            } else {
                //regsin
                signUp(msg, req, res);
            }
        })
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

    function signUp(msg, req, res) {
        
        wb.getInfo(msg)
            .then(function(msg) {
                addUser(msg, req, res)
            })
    }

    //add user by msg from api
    function addUser(msg, req, res) {
        
        new User({
            name: msg.name,
            wbId: msg.id,
            avatar: msg.profile_image_url
        }).save(function(err, user) {
            if (err) throw new Error('Error In addUser'); 
            
            doLogin(user, req, res)
            
        })
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
}

exports.logout = function(req, res) {
    res.clearCookie('token');
    req.session.user = null;
    res.redirect('/');
    
}

function syncUser(user){
  User.update({name: user.name}, {pieces: user.pieces}, function(err) {
    console.log(err)
    if (err) throw new Error('error in user ');
  })
}

exports.fav = function(req, res) {
    var pieceId = req.params.id,
        user = req.session.user || {};

    Piece.findOne({id: pieceId}, function(err, it) {
        if (err) throw new Error('Error when find the pieces');

        if (it) {
            user.favs.push(it._id);
            res.send(it);
            syncUser(user);
        } else {
            res.send({'msg': 'no match'});
        }
    })



}

