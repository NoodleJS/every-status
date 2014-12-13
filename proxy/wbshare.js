var request = require('request');
var querystring = require('querystring');

exports.share = function (user, content) {

  var token = user.wbToken;
  var apiUrl = 'https://api.weibo.com/2/statuses/update.json';
  var postData = querystring.stringify({
    access_token: token,
    status: content
  })
  var url = apiUrl + '?' + postData;

  request.post({url: url, form: {text: content}} ,function(e, r, b) {
    if (e || 'error' in b) throw Error('error in share');
    
  })
}
