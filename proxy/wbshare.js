var request = require('request');
var querystring = require('querystring');

exports.share = function (user, content) {

  var token = user.token;
  var apiUrl = 'https://api.weibo.com/2/statuses/update.json';
  var postData = querystring.stringify({
    access_token: token
  })
  var url = apiUrl + '?' + postData;

  request.post({url: url, form: {status: content}} ,function(e, r, b) {
    if (e) throw Error('error in share');
    console.log(b)
  })
}
