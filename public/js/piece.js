var $ = require('jquery');

var favbtn = $('i.icon-heart'),
	pieceId = favbtn.attr('data-id'),
	Num = $('.count'),
	favbox = $('div.people'),
	favlist = favbox.find('ul'),
	box = favlist.closest('.piece-inner'),
	userId = box.attr('data-userid');

favbtn.on('click',function(){
	if (favbtn.hasClass('liked')) {
		$.ajax({
		  url: "/ajax/nofav/" + pieceId,
		  success: function(data){
		  	var code = data.code,
		  		str = data.msg;
		  	if (code = 200) {
		  		favbtn.removeClass('liked');
		  		console.log(favlist.find('a[href="/users/' + userId + '"]'));
		  		favlist.find('a[href="/users/' + userId + '"]').closest('li').remove();
		  	}else{

		  	};
		  },
		  error:function(){
		  	console.log('error');
		  }
		});
	}else{
		$.ajax({
		  url: "/ajax/fav/" + pieceId,
		  success: function(data){
		  	var fansList = data.list,
		  		fansNum = fansList.length;
		  	favbtn.addClass('liked');
		  	Num.html(fansNum + '人喜欢');
		  	fansList.sort().forEach(function(e){
		  		var id = e.id,
		  			name = e.name,
		  			avatar = e.avatar;
		  		var li = '<li><a href="/users/' + id + '"><img src="' + avatar + '"></a></li>';
		  		favlist.prepend(li);
		  	});
		  },
		  error:function(){
		  	console.log('error');
		  }
		});
	};
});
