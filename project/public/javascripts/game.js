// game.js
// Frontend UI code for the /game page only

(function() {

  "use strict";

  var GameUI = {
    model: new Blaze.Var({
      title        : '',
      active       : true,
      currentRound : 0,
      maxPlayers   : 6,
      currentPhase : 'setup',
      players      : [],
      rounds       : [],
      story_id     : null
    }),
    updateModel: function(gameObject) {
      this.model.set(gameObject); // update the blaze var, templates will patch themselves
      // do anything else we need to do every time new game data comes in
      console.log("Game model changed!", gameObject);
    }
  };

  //// Socket Connection Setup ////

  var socket = io.connect();
  socket.on('connect', function() {
    socket.emit('join', {
      game_id  : window.currentGameId,
      user_id  : window.loggedInUser._id,
      nickname : window.loggedInUser.nickname,
      avatar   : window.loggedInUser.avatar
    });
  });

  //// Non-DOM-Dependent Socket Message Handlers ////

  socket.on('game state changed', function(gameObject) {
    GameUI.updateModel(gameObject);
  });


  $(document).ready(function() {
  
    //// DOM-Dependent Socket Message Handlers ////

    socket.on('join failed', function(reason) {
      // TODO alert user that they couldn't join, and either leave or use spectator mode
      if(reason === 'No Such Room') {
        // TODO
      } else if(reason === 'Room is Full') {
        // TODO
      }
    });

    socket.on('player joined', function(data) {
      console.log("Player Joined: ", data);
      // TODO alert that a player has joined the game
    });

    socket.on('player left', function(data) {
      console.log("Player Left: ", data);
      // TODO alert that a player has left the game
    });

    socket.on('chat message', function(data) {
      var $chatContainer = $('#chat_container');
      $chatContainer.append('<div class="chat_row animated zoomIn"><img src="' + data.avatar + '" alt="" class="round_img" />  '+ data.nickname + ': ' + data.message + "</div>");
      var element = $chatContainer.get(0);
      element.scrollTop = element.scrollHeight;
    });


    //// DOM Event Handlers ////

    $('#chatform').submit(function() {
      socket.emit('chat message', {
        user_id  : window.loggedInUser._id,
        nickname : window.loggedInUser.nickname,
        avatar   : window.loggedInUser.avatar,
        message  : $('#message').val()
      });
      $('#message').val('');
      return false;
    });

  }); // end document ready

}());