
$('#debug_menu').hide();

$('#debug_icon').click(function(){
  $('#debug_menu').toggle();
});



$('.back').hide();

$('.front').click(function(){
  $('.front').addClass('zoomOut');
  $('.back').removeClass('zoomOut');
  $('.back').show().addClass('zoomIn');
});



$('.cancel').click(function(event){
  event.preventDefault();
  $('.back').addClass('zoomOut');
  $('.back').hide();
  $('.front').removeClass('zoomOut');
  $('.front').addClass('zoomIn');
});