var $ = require('jquery');

var sharebtn = $(".toweibo,.todouban");

sharebtn.on("click", function(e) {
  $(this).toggleClass("active");
});