var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var models = {};
/**
  * 存储ID的序列值
  */
SequenceSchema = new Schema({
    _id: String,
    next: Number 
});

SequenceSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

SequenceSchema.statics.increment = function (schemaName, callback) {
    return this.collection.findAndModify({ _id: schemaName }, [], 
            { $inc: { next: 1 } }, {"new":true, upsert:true}, callback);
};

var Sequence = mongoose.model('Sequence', SequenceSchema);

module.exports = Sequence


