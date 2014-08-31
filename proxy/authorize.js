
var crypto = require('crypto');
var User = require('../model/user');


//处理用户登录逻辑

exports.encodeToken = function(token) {
    
    token = typeof token == 'string' ? token : String(token)
    var secret = 'heiheihei';
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(token,'utf8','hex');
    enc += cipher.final('hex');
    return enc;

}


exports.decodeToken = function(token) {

    var secret = 'heiheihei';
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(token,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;

}

exports.shouldLogin = function(req, res, next) {

    //do redict

    if (req.session.user) {
        next()
    } else if (req.cookies.token) {
        
        var token = exports.decodeToken(req.cookies.token)

        User.findOne({_id: token},function(err, it){

            if (err) throw new Error('Error when validate the login')
            if (it) {
                req.session.user = it;
                next()
            } else {
                //to login
                res.redirect('/users/login')
            }
        })

    } else {
        res.redirect('/users/login')
    }
}


