var request = require('request');
var querystring = require('querystring');

var env = global.env || 'development'; 
var db = require('./getConfig').db;

exports.share = function (user, content) {
  var dbId = user.dbId;

  var headers = {
      Authorization: 'Bearer ' + user.dbToken
  }
  var apiUrl = 'https://api.douban.com/shuo/v2/statuses/';
  var postData = querystring.stringify({
    source: db.appkey
  })
  var url = apiUrl;

  
  request.post({url: url, form: {source: db.appkey,text: content},headers: headers} ,function(e, r, b) {
    if (e) throw Error('error in share');
  })
}
