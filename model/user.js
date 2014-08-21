var mongoose = require('mongoose');

var Sequence = require('./sequence');

var userSchema = mongoose.Schema({

    id: { type : Number, index: { unique: true } },
    name: String,
    avatar: String,
    pieces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }],
    work: Boolean,
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }

})

Sequence.incrementId(userSchema, 'User');

var User = mongoose.model('User', userSchema);

module.exports = User