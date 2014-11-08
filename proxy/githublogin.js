var http = require('http')
var querystring = require('querystring');
var request = require('request');
var Q = require('q');

var env = global.env || 'development'; 
var gt = require('./getconfig').gt;

function getCodeCer(code) {
    var _r =  querystring.stringify({
            "client_id": gt.appkey,
            "client_secret": gt.appsecret,
            "redirect_uri": gt.codeUrl,
            "code": code
        });
    return _r;
}

exports.getToken = function (code) {

    var post_data = getCodeCer(code);

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
    //parse info
    var token = querystring.parse(token).access_token;
    var url = gt.infoUrl;

    var deferred = Q.defer();

    var par = querystring.stringify({
        'access_token': token
    })


    url += '?' + par;
    
    request.get({url: url, headers: {'User-Agent' :'every-status'}}, function(e, r, body) {
        
        if (e) {
            console.log('error', e)
            deferred.reject(new Error(e))
        } else {
            body = JSON.parse(body);
            body.token = token;
            deferred.resolve(body)
        }
    })

    return deferred.promise;
}

module.exports = exports