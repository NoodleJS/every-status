var runtime = require('./index');
var DateItem = require('../model/piece');

var _ = require('lodash');

exports.groupByDay = function(cb) {
  var t = DateItem.aggregate([
  {
    $group: {
     _id : { month: { $month: "$created" }, day: { $dayOfMonth: "$created" }, year: { $year: "$created" } }
     ,contents:  { $push: "$$ROOT" }
    }
  }]).exec()
      .then(formatter)
      .then(cb)
}

exports.groupByMonth = function(cb) {
  DateItem.aggregate([
  {
    $group: {
     _id : { month: { $month: "$created" }, year: { $year: "$created" } }
     ,contents:  { $push: "$$ROOT" }
    }
  }]).exec()
      .then(formatter)
      .then(cb)
}

// exports.groupByYear = function(cb) {
//   DateItem.aggregate([
//   {
//     $group: {
//      _id : { month: { year: { $year: "$created" } }
//      ,contents:  { $push: "$$ROOT" }
//     }
//   }]).exec(cb)
// }

function formatter(data) {

  var aim = {}

  data.forEach(function(e) {
    
    aim[e._id.year] = aim[e._id.year] || {}
    aim[e._id.year][e._id.month] = aim[e._id.year][e._id.month] || {}
    aim[e._id.year][e._id.month][e._id.day] = aim[e._id.year][e._id.month][e._id.day] || {}
  
    aim[e._id.year][e._id.month][e._id.day] = e.contents[0].content;
  })
  return aim
}

