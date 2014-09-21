var http = require('http')
var querystring = require('querystring');
var request = require('request');
var Q = require('q');

var env = global.env || 'development'; 
var wb,db = {};

if (env == 'development'){

    wb = require('../settings.example.json').wb
    db = require('../settings.example.json').db

} else if (env == 'production') {

    wb = require('../settings.json').wb
    db = require('../settings.json').db

} else {

    return 
}

//1. 点击链接获取code
//2. 根据code appkey appserect 获取token
//3. 根据token 获取用户信息

exports.getCodeCer = function(code, type) {
    var _r ;
    type = type || 'wb';

    if (type == 'wb') {
        _r =  querystring.stringify({
            "client_id": wb.appkey,
            "client_secret": wb.appsecret,
            "grant_type": 'authorization_code',
            "redirect_uri": wb.codeUrl,
            "code": code
        });
    } else {
        _r =  {
            "client_id": db.appkey,
            "client_secret": db.appsecret,
            "grant_type": 'authorization_code',
            "redirect_uri": db.codeUrl,
            "code": code
        };
    }
    
    return _r;
}

exports.getToken = function (code, type) {
    
    var url;
    var post_data = this.getCodeCer(code, type);

    type = type || 'wb'
    
    if (type == 'db') {
        url = db.tokenUrl;    
    } else {
        url = wb.tokenUrl+'?'+post_data;    
    }

    var deferred = Q.defer();
    if ( type == 'wb') {
        request.post({url:url}, function(e, r, body) {
            if (e) {
                deferred.reject(new Error(e))   
            } else {
                deferred.resolve(JSON.parse(body))    
            }
        })
        return deferred.promise;               
    } else {
        console.log(post_data)
        request.post({url: url, form: post_data}, function(e, r, body) {
            if (e) {
                deferred.reject(new Error(e))   
            } else {
                deferred.resolve(JSON.parse(body))    
            }
        })
        return deferred.promise;               
    }
    
}


exports.getDbInfo = function(msg) {
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
exports.getInfo = function (token) {
    
    var access_token = token.access_token;
    var uid = token.uid;
    var url = wb.infoUrl;

    var deferred = Q.defer();

    var par = querystring.stringify({
        access_token: access_token,
        uid: uid
    })

    url += '?'+par;
    
    request.get({url: url}, function(e, r, body) {
        if (e) {
            deferred.reject(new Error(e))
        } else {
            deferred.resolve(JSON.parse(body))
        }
    })

    return deferred.promise;
}

module.exports = exports
