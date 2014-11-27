// game.js
// Frontend UI code for the /game page only

(function() {

  "use strict";

  var GameUI = {
    model: new Blaze.Var({
      title        : '',
      owner        : null,
      active       : true,
      currentRound : 0,
      maxPlayers   : 6,
      currentPhase : 'setup',
      players      : [],
      rounds       : [],
      story_id     : null,
      adaptedStory : null
    }),
    updateModel: function(gameObject) {
      this.model.set(gameObject); // update the blaze var, templates will patch themselves
      // do anything else we need to do every time new game data comes in
      console.log("Game model changed!", gameObject);
    }
  };


  //// Blaze Template Helpers ////

  Template.sidebar.players = function() {
    return GameUI.model.get().players;
  };

  Template.sidebar.currentRound = function() {
    return GameUI.model.get().currentRound + 1;
  };

  Template.gameArea.inSetupPhase = function() {
    return GameUI.model.get().currentPhase === 'setup';
  }

  Template.storyArea.story_id = function() {
    return '5472bc84e5979740d4628a78';
  };

  Template.gameArea.players = function() {
    return GameUI.model.get().players;
  };

  Template.waitingArea.playersNeeded = function() {
    return  (6 - GameUI.model.get().players.length);
  };


  //// Socket Connection Setup ////

  var socket = io.connect();
  socket.on('connect', function() {
    socket.emit('join', {
      game_id  : window.currentGameId,     // these globals are set inline in views/partials/header.ejs
      user_id  : window.loggedInUser._id,
      nickname : window.loggedInUser.nickname,
      avatar   : window.loggedInUser.avatar
    });
  });


  //// Non-DOM-Dependent Socket Message Handlers ////

  socket.on('game state changed', function(gameObject) {
    GameUI.updateModel(gameObject);
  });

  // DEBUG: call ping() to see a list on console of connected clients in the same game room
  window.ping = function() {
    socket.emit('ping');
  };

  socket.on('ping', function() {
    socket.emit('pong', window.loggedInUser);
  });

  socket.on('pong', function(data) {
    console.log("PONG:", data.nickname);
  });


///////////////////////////////////////////////////////////////////////////////


  $(document).ready(function() {

    //// Blaze Template Initializations ////

    /*
      For this page, we're using a reactive templating system called Blaze: http://meteor.github.io/blaze/
      Blaze takes over the entire page by default, but the below code overrides that behavior to only use
      Blaze on certain elements of the page.  This approach is based on the discussion found here:
      https://groups.google.com/forum/#!topic/blazejs/64y_JqzgcIg
    */

    if(Template.sidebar) {
      var parentNode = $("#sidebar_parent").get(0);
      UI.insert(UI.render(Template.sidebar), parentNode);
    }

    if(Template.gameArea) {
      var parentNode = $("#gameArea_parent").get(0);
      UI.insert(UI.render(Template.gameArea), parentNode);
    }


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