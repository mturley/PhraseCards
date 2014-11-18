$('.friend-filter').keyup(function (event){
	var re = new RegExp('^' + $('.friend-filter').val());
	$('#friend > li').each(function (index) {
      if (!re.test($('.potential_friend').text())) {
        $('.potential_friend').hide();
      }
      else {
        $('.potential_friend').show();
      }
    });
});






/*
  $('#fruit-filter').keyup(function (event) {
    var re = new RegExp('^' + $('#fruit-filter').val());
    $('#fruit > li').each(function (index) {
      if (!re.test($(this).text())) {
        $(this).hide();
      }
      else {
        $(this).show();
      }
    });
  });
  */
