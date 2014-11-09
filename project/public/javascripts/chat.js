var socket = io();
var messages= [];

$('#chatform').submit(function(){
	socket.emit('chat message', $('#message').val());
	$('#message').val('');
	return false;
});

socket.on('chat message', function(msg){
	if (messages.length <=0  || messages.length <= 2) {
		messages.push(msg);
	}else {
		messages.splice(0,1);
		messages.push(msg);
	}
	// Replace with user info
	$('.chat_message1').html('<span class="chat_message"><img src="http://placehold.it/100x100" class="round_img"/> Username:  ' + messages[0] + '</span>');
	if (messages.length > 1) {
		$('.chat_message2').html('<span class="chat_message"><img src="http://placehold.it/100x100" class="round_img"/> Username:  ' + messages[1] + '</span>');
		if (messages.length > 2) {
			$('.chat_message3').html('<span class="chat_message"><img src="http://placehold.it/100x100" class="round_img"/> Username:  ' + messages[2] + '</span>');
		}
	}
});
