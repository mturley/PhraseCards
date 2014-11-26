$('.potential_friend').hide();
$('.friend-filter').keyup(function (event){
	var re = new RegExp('^' + $('.friend-filter').val());
	$('#friend > li .friend_name').each(function () {
    if (!re.test($(this).text())) {
    //console.log("hide: "+$(this).text());
      $(this).parent().parent().parent().hide();
    }else {
    //console.log("show: "+$(this).text());
      $(this).parent().parent().parent().show();
    }
  });
});