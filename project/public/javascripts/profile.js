$('.friend-filter').keyup(function (event){
	var re = new RegExp('^' + $('.friend-filter').val());
	$('#friend > li .friend_name').each(function () {
		console.log(re);
      	if (!re.test($(this).text())) {
      		//console.log("hide: "+$(this).text());
        	$(this).parent().hide();
      	}
      	else {
      		//console.log("show: "+$(this).text());
        	$(this).parent().show();
      	}
    });
}); 