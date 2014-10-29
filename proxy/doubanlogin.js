var http = require('http')
var querystring = require('querystring');
var request = require('request');
var Q = require('q');

var env = global.env || 'development'; 
var db = {};

if (env == 'development'){

    db = require('../settings.example.json').db

} else if (env == 'production') {

    db = require('../settings.json').db

} else {

    return 
}

//1. 点击链接获取code
//2. 根据code appkey appserect 获取token
//3. 根据token 获取用户信息

exports.getCodeCer = function(code) {
    var _r =  querystring.stringify({
            "client_id": db.appkey,
            "client_secret": db.appsecret,
            "grant_type": 'authorization_code',
            "redirect_uri": db.codeUrl,
            "code": code
        });
    console.log(_r);
    return _r;
}

exports.getToken = function (code) {

    var post_data = this.getCodeCer(code);

    var url = db.tokenUrl;

    var deferred = Q.defer();

    request.post({url: url, form: post_data}, function(e, r, body) {
        if (e) {
            deferred.reject(new Error(e))   
        } else {
            deferred.resolve(JSON.parse(body))    
        }
    })
    return deferred.promise;       
}

exports.getInfo = function (msg) {
    var token = msg.access_token;
    var url = db.infoUrl;

    var deferred = Q.defer();
    var headers = {
        Authorization: 'Bearer ' + token
    }
    request.get({url: url, headers: headers}, function(e, r, body) {
        if (e) {
            deferred.reject(new Error(e))
        } else {
            deferred.resolve(JSON.parse(body))
        }
    })
    return deferred.promise;
}

module.exports = exports