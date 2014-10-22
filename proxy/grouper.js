var DateItem = require('../model/piece')

exports.groupByDay = function(cb) {
  DateItem.aggregate([
  {
    $group: {
     _id : { month: { $month: "$created" }, day: { $dayOfMonth: "$created" }, year: { $year: "$created" } }
     ,contents:  { $push: "$$ROOT" }
    }
  }]).exec(cb)
}

exports.groupByMonth = function(cb) {
  DateItem.aggregate([
  {
    $group: {
     _id : { month: { $month: "$created" }, year: { $year: "$created" } }
     ,contents:  { $push: "$$ROOT" }
    }
  }]).exec(cb)
}

exports.groupByYear = function(cb) {
  DateItem.aggregate([
  {
    $group: {
     _id : { month: { year: { $year: "$created" } }
     ,contents:  { $push: "$$ROOT" }
    }
  }]).exec(cb)
}