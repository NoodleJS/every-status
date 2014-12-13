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

SequenceSchema.statics.findAndModify = function(query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

SequenceSchema.statics.increment = function(schemaName, callback) {
  return this.collection.findAndModify({
    _id: schemaName
  }, [], {
    $inc: {
      next: 1
    }
  }, {
    "new": true,
    upsert: true
  }, callback);
};

var Sequence = db.model('Sequence', SequenceSchema);

//在创建文档时，获取自增ID值

exports.incrementId = function(sechema, model) {
  sechema.pre('save', function(next) {
    var self = this;
    if (self.isNew) {
      Sequence.increment(model, function(err, result) {
        if (err)
          throw err;
        self.id = result.next;
        next();
      });
    } else {
      next();
    }
  })
}