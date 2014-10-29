//document https://developer.github.com/v3/repos/#create

var querystring = require('querystring');
var request = require('urllib');

var baseUrl = 'https://api.github.com';
var fakeUser = {
  gtName: ''
  gtToken: ''
}

function doCheck(user) {
  var apiPath = '/repos/' 
      + user.gtName 
      + '/'
      + 'every-day'
      + '/collaborators/'
      + 'NoodleJS' // org name 
      +'?access_token=' 
      + user.token;

  var url = baseUrl + apiPath;

  request.request(url, {
    method: 'PUT',
    headers: {
      'Content-Length': 0
    }
  }, function(err, data, res) {
    if (err) {
      console.log(err);
    }
    console.log(JSON.stringify(data, null, 2));
  });

}



exports.initRepo = function(user) {
  var apiPath = '/user/repos';

}

exports.updateRepo = function(user) {

}

exports.removeRepo = function(user) {

}
