
$('#debug_menu').hide();

$('#debug_icon').click(function(){
  $('#debug_menu').toggle();
});

$('.back').hide();
$('nav').hide();

$('.fa-bars').click(function(){
    $('nav').slideToggle( "slow" );
});


$('.front').click(function(){
  $('.front').addClass('zoomOut');
  $('.back').removeClass('zoomOut').show().addClass('zoomIn');
});

$('.cancel').click(function(event){
  event.preventDefault();
  $('.back').addClass('zoomOut').hide();
  $('.front').removeClass('zoomOut').addClass('zoomIn');
});