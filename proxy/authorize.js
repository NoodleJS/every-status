
var crypto = require('crypto');
var User = require('../model/user');


//处理用户登录逻辑

function encodeToken(token) {

    var secret = 'heiheihei';
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(token,'utf8','hex');
    enc += cipher.final('hex');
    return enc;

}

function decodeToken(token) {

    var secret = 'heiheihei';
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(token,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;

}

exports.shouldLogin = function(req, res, next) {

    function hasCookie(cookie) {
        console.log(cookie)
    }
    //do redict
    if (req.session.user) {
        next()
    } else if (req.cookie.token) {
        var token = decodeToken(req.cookie.token)
        User.findOne({_id: token},function(err, it){

            if (err) throw new Error('Error when validate the login')

            if (it) {
                next()
            } else {
                res.redirect('/add')
            }
        })

    } else {
        res.redirect('/add')
    }
}


