
$('#debug_menu').hide();

$('#debug_icon').click(function(){
  $('#debug_menu').toggle();
});

$('#new_game_container').click(function(){
  $('#new_game_card').toggleClass('flip');
});

$('.flipback').click(function(e){
  e.preventDefault();
  $('#new_game_card').toggleClass('flip');
});