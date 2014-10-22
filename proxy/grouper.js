var DateItem = require('../model/piece')

exports.getPieces = function(cb) {
  DateItem.aggregate([
  {
    $group: {
     _id : { month: { $month: "$created" }, day: { $dayOfMonth: "$created" }, year: { $year: "$created" } }
     ,contents:  { $push: "$$ROOT" }
    }
  }]).exec(cb)
}