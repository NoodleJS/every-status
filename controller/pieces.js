var Piece = require('../model/piece');

exports.create = function(req, res) {
  new Piece({
    content: req.params.content,
    link: req.params.link,
    work: true
  }).save(function(e) {
    //console.log('over')

  });
  res.send(200,{'code':'200'})
}

exports.list = function(req, res) {
  Piece.find(function(err, pieces) {
    //handler the result
    res.send(pieces);
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
      piece: piece
    })
  })
}

