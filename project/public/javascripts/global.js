
$('#debug_menu').hide();

$('#debug_icon').click(function(){
  $('#debug_menu').toggle();
});

$('nav').hide();

$('.fa-bars').click(function(){
    $('nav').slideToggle( "slow" );
});