var Piece = require('../model/piece');

exports.index = function(req, res) {
  Piece.find({})
    .sort('-created')
    .exec(handlerData)

  function handlerData(err, set) {
    if (err) console.log(err)
    if (set) {
      res.render('index', {
        title: '此刻...',
        name: 'index',
        user: req.session.user,
        favs: set
      })
    }
  }
}