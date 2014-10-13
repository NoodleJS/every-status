var Piece = require('../model/piece');

exports.index = function(req, res) {
    Piece.find({})
        .sort('-created')
        .exec(handlerData)

    function handlerData(err, set) {
        if (err) console.log(err)
        if (set) {
            res.send(set)
        }
    }
}

