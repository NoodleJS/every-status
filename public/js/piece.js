var $ = require('jquery');

var favbtn = $('i.icon-heart'),
	pieceId = favbtn.attr('data-id'),
	Num = $('.count'),
	favbox = $('div.people'),
	favlist = favbox.find('ul'),
	box = favlist.closest('.piece-inner'),
	userId = box.attr('data-userid');

favbtn.on("click", function() {
	var LIKED = "liked";
	if (favbtn.hasClass(LIKED)) {
		$.ajax({
			url: "/ajax/nofav/" + pieceId,
			success: function(data) {
				var code = data.code,
					str = data.msg;
				if (code = 200) {
					favbtn.removeClass('liked');
					favlist.removeClass('liked');
				} else {

				};
			},
			error: function() {
				console.log('error');
			}
		});
	} else {
		$.ajax({
			url: "/ajax/fav/" + pieceId,
			success: function(data) {
				favbtn.addClass('liked');
				favlist.addClass('liked');
			},
			error: function() {
				console.log('error');
			}
		});
	}
})