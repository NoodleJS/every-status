var http = require('http')
var querystring = require('querystring');
var request = require('request');

var env = global.env || 'developer'; 
var wb = {};


if (env == 'developer'){

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

    request.post({url:url} , function(e, r, body) {
        var body = JSON.parse(body);
        if (e) throw Error('Error when get access_token')
        
        console.log(body.error)
    })


    return body.acce
}

exports.getUid = function (token) {
    return ' '
}

exports.testRe = function (code) {

}

exports.getToken('61c4544de59a5192af817e51a0e88349')