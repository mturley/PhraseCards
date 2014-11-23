// game.js
// Frontend UI code for the /game page only

(function() {

  "use strict";
  
  var socket = io.connect();
  socket.on('connect', function() {
    socket.emit('join', { game_id: window.currentGameId, user_id: window.loggedInUser._id });
  });

  $(function() {
    // DOM ready
  });

}());