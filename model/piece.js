var mongoose = require('mongoose');

var Sequence = require('./sequence');

var pieceSchema = mongoose.Schema({

    id: { type : Number, index: { unique: true } },
    content: String,
    link: String,
    pics:[String] ,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    work: Boolean,
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }

})

Sequence.incrementId(pieceSchema, 'Piece')

var Piece = db.model('Piece', pieceSchema);

module.exports = Piece