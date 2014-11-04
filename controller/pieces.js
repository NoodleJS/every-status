var marked = require('marked');
var Piece = require('../model/piece');
var User = require('../model/user');
var share = require('../proxy/wbshare');

exports.create = function(req, res) {
  var user = req.session.user;
  var content = req.body.content;
  var needShare = req.body.wbShare;

  new Piece({
    content: content,
    link: req.body.link,
    work: true, 
    author: user._id
  }).save(function(e, it) {
    if(e) throw new Error('error in save ');
    user.pieces.push(it._id)
    res.redirect('/piece/' + it.id);
    syncUser(user);
  });

  if (needShare) {
    share.share(user, content);
  }
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

  Piece.find({author: req.session.user._id})
      .sort('-created')
      .exec(handlerData);

      function handlerData(err, pieces){

        pieces = pieces.map(function(e) {
                e.content = marked(e.content);
                return e
              })

        if (err) throw err
        res.render('user', { title: '今天...', 
            name: 'people',
            user: req.session.user,
            tuser: req.session.user,
            current: req.session.user, 
            pages: 1,
            index: 1,
            favs: pieces
        })  
      }
}
exports.show = function(req, res) {

  var id = req.params.id;

  console.log(id);

  if (isNaN(id)) {
    throw new Error('请输入正确的id值')
  }

  Piece.findOne({id: id}, function(err, piece) {
      if (err) throw new Error('Error In DB');
      if (piece) {
          piece.content = marked(piece.content);
          var user = req.session.user;
          var favs = req.session.user.favs;
          var liked = favs.indexOf(piece._id + '');
          piece.populate('fans', function(err, set) {
              res.render('piece', {
                titel: '每思每刻',
                name: 'piece',
                piece: piece,
                user: req.session.user,
                fans: set.fans,
                liked: liked,
                fav_count: piece.fans.length
              }) 
          })
      } else {
          res.redirect('/')
      }
  })
}




