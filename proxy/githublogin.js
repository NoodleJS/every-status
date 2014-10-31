var http = require('http')
var querystring = require('querystring');
var request = require('request');
var Q = require('q');

var env = global.env || 'development'; 
var gt = {};

if (env == 'development'){

    gt = require('../settings.example.json').gt

} else if (env == 'production') {

    gt = require('../settings.json').gt

} else {

    return 
}

exports.getCodeCer = function(code) {
    var _r =  querystring.stringify({
            "client_id": gt.appkey,
            "client_secret": gt.appsecret,
            "redirect_uri": gt.codeUrl,
            "code": code
        });
    return _r;
}

exports.getToken = function (code) {

    var post_data = this.getCodeCer(code);

    var url = gt.tokenUrl + '?' + post_data;

    var deferred = Q.defer();

    request.post({url:url}, function(e, r, body) {
        console.log('token=' + body);
        if (e) {
            deferred.reject(new Error(e))   
        } else {
            deferred.resolve(body)    
        }
    })
    return deferred.promise;       
}

exports.getInfo = function (token) {
    console.log('getInfo=' + token);
    var access_token = token.access_token;
    var url = gt.infoUrl;

    var deferred = Q.defer();

    var par = querystring.stringify({
        'access_token': access_token
    })


    url += '?' + par;
    
    request.get({url: url, 'User-Agent' :'every-status'}, function(e, r, body) {
        console.log('info' +body);
        if (e) {
            deferred.reject(new Error(e))
        } else {
            body.token = access_token;
            deferred.resolve(body)
        }
    })

    return deferred.promise;
}

module.exports = exports