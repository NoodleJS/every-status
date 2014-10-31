var http = require('http')
var querystring = require('querystring');
var request = require('request');
var Q = require('q');

var env = global.env || 'development'; 
var wb = {};

if (env == 'development'){

    wb = require('../settings.example.json').wb

} else if (env == 'production') {

    wb = require('../settings.json').wb

} else {

    return 
}

//1. 点击链接获取code
//2. 根据code appkey appserect 获取token
//3. 根据token 获取用户信息

exports.getCodeCer = function(code) {
    var _r =  querystring.stringify({
            "client_id": wb.appkey,
            "client_secret": wb.appsecret,
            "grant_type": 'authorization_code',
            "redirect_uri": wb.codeUrl,
            "code": code
        });
    
    return _r;
}

exports.getToken = function (code) {
    
    var url;
    var post_data = this.getCodeCer(code);

    url = wb.tokenUrl+'?'+post_data;       

    var deferred = Q.defer();
    
    request.post({url:url}, function(e, r, body) {
        if (e) {
            deferred.reject(new Error(e))   
        } else {
            deferred.resolve(JSON.parse(body))    
        }
    })
    return deferred.promise;               
    
}

exports.getInfo = function (token) {
    
    var access_token = token.access_token;
    var uid = token.uid;
    var url = wb.infoUrl;

    var deferred = Q.defer();

    var par = querystring.stringify({
        access_token: access_token,
        uid: uid
    })

    url += '?'+ par;
    
    request.get({url: url}, function(e, r, body) {
        if (e) {
            deferred.reject(new Error(e))
        } else {
            body.token = access_token;
            deferred.resolve(JSON.parse(body))
        }
    })

    return deferred.promise;
}

module.exports = exports

