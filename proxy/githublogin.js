var http = require('http')
var querystring = require('querystring');
var request = require('request');
var Q = require('q');

exports.getCodeCer = function(code) {
    var _r =  querystring.stringify({
            "client_id": '7a715634f6e72ea6d720',
            "client_secret": '281c0d3e62cb71a57082000176397c7de1a7f66f',
            "redirect_uri": 'http://www.baidu.com?code=',
            "code": code
        });
    return _r;
}

exports.getToken = function (code) {

    var post_data = this.getCodeCer(code);

    var url = 'https://github.com/login/oauth/access_token?'+post_data

    var deferred = Q.defer();

    request.post({url:url}, function(e, r, body) {
        console.log(body)
    })
    return deferred.promise;       
}

exports.getToken();