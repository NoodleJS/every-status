var http = require('http')
var querystring = require('querystring');
var request = require('request');
var Q = require('q');

var env = global.env || 'development'; 
var wb,db,gt = {};

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
    } else if(type == 'db'){
        _r =  {
            "client_id": db.appkey,
            "client_secret": db.appsecret,
            "grant_type": 'authorization_code',
            "redirect_uri": db.codeUrl,
            "code": code
        };
    }else if(type == 'gt'){
        _r =  {
            "client_id": gt.appkey,
            "client_secret": gt.appsecret,
            "grant_type": 'authorization_code',
            "redirect_uri": gt.codeUrl,
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
    } else if (type == 'wb'){
        url = wb.tokenUrl+'?'+post_data;    
    }else{
        url = gt.tokenUrl+'?'+post_data;    
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
    } else if(type == 'db'){
        console.log(post_data)
        request.post({url: url, form: post_data}, function(e, r, body) {
            if (e) {
                deferred.reject(new Error(e))   
            } else {
                deferred.resolve(JSON.parse(body))    
            }
        })
        return deferred.promise;               
    }else if(type == 'gt'){
        request.post({url:url}, function(e, r, body) {
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
            body.token = access_token;
            deferred.resolve(JSON.parse(body))
        }
    })

    return deferred.promise;
}

module.exports = exports

