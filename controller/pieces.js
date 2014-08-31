var Piece = require('../model/piece');
var User = require('../model/user');

exports.create = function(req, res) {
  var user = req.session.user;
  
  new Piece({
    content: req.body.content,
    link: req.body.link,
    work: true, 
    author: user._id
  }).save(function(e, it) {
    if(e) throw new Error('error in save ');
    user.pieces.push(it._id)
    res.redirect('/piece/' + it.id);
    syncUser(user);
  });

  
}

function syncUser(user){
  User.update({name: user.name}, {pieces: user.pieces}, function(err) {
    console.log(err)
    if (err) throw new Error('error in user ');
  })
}


exports.list = function(req, res) {

  //default display
  req.session.user = req.session.user || {}

  Piece.find({author: req.session.user._id},function(err, pieces) { 
      if (err) throw err
      res.render('user', { title: '今天...', 
          name: 'people',
          user: req.session.user,
          current: req.session.user, 
          pages: 1,
          index: 1,
          favs: pieces
      })  
  })
}

exports.show = function(req, res) {

  var id = req.params.id;

  if (isNaN(id)) {
    throw new Error('请输入正确的id值')
  }

  Piece.findOne({
    id: id
  }, function(err, piece) {
    //handler the piece
    res.render('piece', {
      titel: '每思每刻',
      name: 'piece',
      piece: piece,
      user: req.session.user,
      favs: [req.session.user],
      liked: false,
      fav_count: 1
    })
  })
}


