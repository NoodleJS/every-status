var $ = require('jquery');

var favbtn = $('.icon-heart'),
	pieceId = favbtn.attr('data-id'),
	Num = $('.count');
favbtn.on('click',function(){
	$.ajax({
	  url: "/temp/fav/" + pieceId,
	  success: function(data){
	  	var fansList = data.fans,
	  		fansNum = data.fans.length;
	  	Num.html(fansNum + '人喜欢');
	  },
	  error:function(){
	  	console.log('error');
	  }
	});
});