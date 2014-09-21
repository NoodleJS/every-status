var querystring = require('querystring');
var User = require('../model/user');
var wb = require('../proxy/wblogin');
var coder = require('../proxy/authorize');
var config = require('../proxy/getconfig');

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
        //
        if (code && type=='db') {
            wb.getToken(code, type)
                .then(function(msg) {
                    handlerDb(msg, req, res)
                })
        }
        if (code) {
            wb.getToken(code, type)
                .then(function(msg){
                    handlerToken(msg, req, res)   
                })    
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
        User.findOne({dbId: did}, function(err, user) {
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

        req.session.user = user;
        var token = coder.encodeToken(user._id);
        res.cookie('token', token,  { maxAge: 3600 * 24 * 7, httpOnly: false });
        res.redirect('/');
    }

    function signUp(msg, req, res) {
        wb.getInfo(msg)
            .then(function(msg, req, res) {
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

