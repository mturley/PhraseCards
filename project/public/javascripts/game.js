// game.js
// Frontend UI code for the /game page only

(function() {

  "use strict";
  
  var socket = io.connect();
  socket.on('connect', function() {
    socket.emit('join', { game_id: window.currentGameId, user_id: window.loggedInUser._id });
  });

  // TODO set up Blaze variables and template stuff here

  $(document).ready(function() {
  
    //// Chat ////

    $('#chatform').submit(function() {
      socket.emit('chat message', {
        user_id  : window.loggedInUser._id,
        nickname : window.loggedInUser.nickname,
        avatar   : window.loggedInUser.avatar,
        message  : $('#message').val()
      });
      return false;
    });

    function updateChatScroll() {
      var element = document.getElementById("chat_container");
      element.scrollTop = element.scrollHeight;
    }

    socket.on('chat message', function(data) {
      $('#chat_container').append('<div class="chat_row animated zoomIn"><img src="' + data.avatar + '" alt="" class="round_img" />  '+ data.nickname + ': ' + data.message + "</div>");
      updateChatScroll();
    });

    //// Game Actions ////

    // TODO

  }); // end document ready

}());