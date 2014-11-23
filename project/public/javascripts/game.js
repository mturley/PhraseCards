// game.js
// Frontend UI code for the /game page only

(function() {

  "use strict";
  
  var socket = io.connect();
  socket.on('connect', function() {
    socket.emit('join', { gameId: window.currentGameId, userId: window.loggedInUser._id });
  });

  $(function() {
    // DOM ready
  });

}());