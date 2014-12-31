
exports.index = function *index() {  
  var user = req.session.user || {};
  this.body = user;
}