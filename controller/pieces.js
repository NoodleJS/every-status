var Piece = require('../model/piece');

exports.create = function(req, res) {
  new Piece({
    content: "Lets start from here!",
    link: "http://github.com/elrrrrrrr",
    work: true
  }).save(function(e) {
    console.log('success')
  });
  console.log('over')
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

exports.create()