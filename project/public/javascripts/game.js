// game.js
// Frontend UI code for the /game page only

(function() {

  "use strict";
  
  var socket = io.connect();
  socket.on('connect', function() {
    socket.emit('join', {
      game_id  : window.currentGameId,
      user_id  : window.loggedInUser._id,
      nickname : window.loggedInUser.nickname,
      avatar   : window.loggedInUser.avatar
    });
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

    //// Game State Changes ////

    socket.on('join failed', function(reason) {
      // TODO alert user that they couldn't join, and either leave or use spectator mode
      if(reason === 'No Such Room') {
        // TODO
      } else if(reason === 'Room is Full') {
        // TODO
      }
    });

    socket.on('player joined', function(user_id, game) {
      // TODO update state with game object, maybe alert that a player has joined by lookup from user_id
    });

    socket.on('player left', function(user_id, game) {
      // TODO update state with game object, maybe alert that a player has left by lookup from user_id
    });

    //// Game Actions ////

    // TODO

  }); // end document ready

}());