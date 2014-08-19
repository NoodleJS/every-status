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
  Piece.findOne({
    title: req.params.title
  }, function(err, piece) {
    //handler the piece
    res.send(piece)
  })
}
