var socket = io();
var messages= [];

$('#chatform').submit(function(){
  socket.emit('chat message', $('#message').val());
  $('#message').val('');
  return false;
});

function updateScroll(){
  var element = document.getElementById("chat_container");
  element.scrollTop = element.scrollHeight;
}

socket.on('chat message', function(msg){
  // Replace with user info
  $('#chat_container').append('<div class="chat_row animated zoomIn"><img src="http://placehold.it/200x200" alt="" class="round_img" />  ' + msg + "</div>");
  updateScroll();
});
