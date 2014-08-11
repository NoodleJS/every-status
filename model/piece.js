var mongoose = require('mongoose');

var pieceSchema = mongoose.Schema({
    content: String,
    link: String,
    pics:[String] ,
    //author: Objectid ,
    work: Boolean,
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
})

var Piece = mongoose.model('Piece', pieceSchema);

var p = new Piece

p.save(function(err){
  if(err) console.log(err)
})

module.exports = Piece


