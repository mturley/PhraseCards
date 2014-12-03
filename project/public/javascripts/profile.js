$('.potential_friend').hide();
$('.friend-filter').keyup(function (event){
	var re = new RegExp('^' + $('.friend-filter').val().toLowerCase());
	$('#friend > li .friend_name').each(function () {
    if (!re.test($(this).text().toLowerCase()) || re.test("")) {
      $(this).parent().parent().parent().hide();
    }else {
      $(this).parent().parent().parent().show();
    }
  });
});