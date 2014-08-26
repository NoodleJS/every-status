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

exports.getToken = function (code) {

    

    var post_data = querystring.stringify({
        "client_id": wb.appkey,
        "client_secret": wb.appsecret,
        "grant_type": 'authorization_code',
        "redirect_uri": 'http://www.baidu.com',
        "code": code
    });

    var url = 'https://api.weibo.com/oauth2/access_token?'+post_data

    

    function syncToken(){
        var deferred = Q.defer();

        request.post({url:url}, function(e, r, body) {
            if (e) {
                deferred.reject(new Error(error))   
            } else {
                deferred.resolve(JSON.parse(body).access_token)    
            }
        })
        return deferred.promise    
    }
    
    var token = ' ';

    return syncToken()

    
    // var token = ' ';
    // request.post({url:url} , function(e, r, body) {
    //     if (e) console.log(e)
    //     var body = JSON.parse(body);
        
    //     token = body.access_token;        
    // })    
    // return token;

    
    
}

exports.getUid = function (code) {

}

exports.testRe = function (code) {

}

module.exports = exports