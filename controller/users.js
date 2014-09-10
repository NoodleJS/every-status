var User = require('../model/user');
var wb = require('../proxy/wblogin');
var coder = require('../proxy/authorize');

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
            wb.getToken(code, type)
                .then(handlerToken)    
        } else {
            if (type=='wb') {
                res.redirect('https://api.weibo.com/oauth2/authorize?client_id=2830334342&redirect_uri=http://www.every-status.com/users/login&response_type=code');    
            } else {
                res.redirect('https://www.douban.com/service/auth2/auth?client_id=051b66b9c014efa10f52342d403ecee3&redirect_uri=http://www.baidu.com&response_type=code');
            }
            
        }
    }

    function handlerToken(msg) {
        console.log(msg)
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
                signUp(msg);
            }
        })
    }

    function doLogin(user) {

        req.session.user = user;
        var token = coder.encodeToken(user._id);
        res.cookie('token', token,  { maxAge: 3600 * 24 * 7, httpOnly: false });
        res.redirect('/');
    }

    function signUp(msg) {
        wb.getInfo(msg)
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
    res.clearCookie('token');
    req.session.user = null;
    res.redirect('/');
    
}

