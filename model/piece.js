var mongoose = require('mongoose');

var Sequence = require('./sequence');

var pieceSchema = mongoose.Schema({

    id: { type : Number, index: { unique: true } },
    content: String,
    link: String,
    pics:[String] ,
    author: mongoose.Schema.ObjectId ,
    work: Boolean,
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
    
})

//在创建文档时，获取自增ID值
pieceSchema.pre('save', function(next) {
    var self = this;
    if( self.isNew ) {
        Sequence.increment('Piece',function (err, result) {
            if (err)
              throw err;
            self.id = result.next;
            next();
        });
    } else {
        next();
  }
})

var Piece = mongoose.model('Piece', pieceSchema);

module.exports = Piece