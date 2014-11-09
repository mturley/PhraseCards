var socket = io();

$('#chatform').submit(function(){
	socket.emit('chat message', $('#message').val());
	$('#message').val('');
	return false;
});

socket.on('chat message', function(msg){
	$('#chat_container').append('<strong>Username: </strong> ' + msg + "<br/>");
});
