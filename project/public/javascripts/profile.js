$('.friend-filter').keyup(function (event){
	var re = new RegExp('^' + $('.friend-filter').val());
	$('#friend > li').each(function (index) {
      if (!re.test($('.potential_friend').text())) {
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