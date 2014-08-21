var User = require('../model/user');

exports.create = function(req, res) {
  new User({
    name: req.body.name,
    avatar: req.body.avatar,
    work: true

  }).save(function(err) {
    if(err) {
      console.log(err)
    }
  })
}

exports.fake = function(req, res) {
    new User({
        name: 'elrrrrrrr', 
        avatar: 'http://tp1.sinaimg.cn/2017654444/50/5635300102/1', 
        work: true
    }).save(function(err,it) {
        console.log(it)
    })
    res.send({'code':200})
}
