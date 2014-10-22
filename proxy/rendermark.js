var _ = require('lodash');

var mock = {
  "2014": {
    "01": {
      "01": "YeYeYe!",
      "02": "YeYeYe!"
    },
    "03": {
      "04": "Okk"
    }
  }
}

var monthName = {
  '01': '一月',
  '02': '二月',
  '03': '三月',
  '04': '四月',
  '05': '五月',
  '06': '六月',
  '07': '七月',
  '08': '八月',
  '09': '九月',
  '10': '十月',
  '11': '十一月',
  '12': '十二月'
}

var monthLink = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec'
}

function heredoc(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
}
 
var template = heredoc(function(){/*
# Everyday

> 重要的不是你想做什么，而是你做了什么。

##  日历
<%Object.keys(data['2014']).forEach(function(e) {%>

* -[ ] [<%=monthName[e]%>](#<%=monthLink[e]%>) 
<%})%>
*/})

exports.mark = function(path, data) {
  var compiled = _.template(template, {data: mock, monthName: monthName, monthLink: monthLink});
  
  console.log(compiled)
}

exports.mark()