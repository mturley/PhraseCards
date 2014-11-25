$('.friend-filter').keyup(function (event){
	var re = new RegExp('^' + $('.friend-filter').val());
	$('#friend > ul').each(function () {
		console.log(re);
      	if (!re.test($(this).text())) {
      		console.log("hide");
      		console.log(('.potential_friend').text());
        	$('.potential_friend').hide();
      	}
      	else {
      		console.log("show");
      		console.log(('.potential_friend').text());
        	$('.potential_friend').show();
      	}
    });
}); 