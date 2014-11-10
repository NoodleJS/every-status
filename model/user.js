var mongoose = require('mongoose');

var Sequence = require('./sequence');

var userSchema = mongoose.Schema({

    id: { type : Number, index: { unique: true } },
    wbId: String,
    dbId: String,
    gtId: String,
    name: String,
    avatar: String,
    wbToken: String,
    gtToken: String,
    dbToken: String,
    pieces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }],
    favs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }],
    work: Boolean,
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }

})

Sequence.incrementId(userSchema, 'User');

var User = db.model('User', userSchema);

module.exports = User