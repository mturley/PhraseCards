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
    },
    availableStories: new Blaze.Var([]),
    reloadStories: function() {
      $.ajax({
        type : 'GET',
        url  : '/api/stories'
      }).done(function(data) {
        GameUI.availableStories.set(data);
      }).fail(function() {
        console.log("AJAX FAILURE", arguments);
      });
    }
  };

  GameUI.reloadStories();


  //// Blaze Template Helpers ////

  Template.sidebar.players = function() {
    return GameUI.model.get().players;
  };

  Template.sidebar.currentRound = function() {
    return GameUI.model.get().currentRound + 1;
  };

  ////

  Template.waitingArea.notEnoughPlayers = function() {
    var game = GameUI.model.get();
    return game.players.length < game.minPlayers;
  };

  Template.waitingArea.playersNeeded = function() {
    var game = GameUI.model.get();
    return (game.minPlayers - game.players.length);
  };

  Template.waitingArea.slotsLeft = function() {
    var game = GameUI.model.get();
    return (game.maxPlayers - game.players.length);
  };

  Template.waitingArea.gameReady = function() {
    var game = GameUI.model.get();
    return (game.players.length >= game.minPlayers && game.story_id != null);
  };

  Template.waitingArea.availableStories = function() {
    return GameUI.availableStories.get();
  };

  Template.waitingArea.noStorySelected = function() {
    return GameUI.model.get().story_id === null;
  };

  ////

  Template.gameArea.inSetupPhase = function() {
    return GameUI.model.get().currentPhase === 'setup';
  };

  Template.gameArea.inSubmissionPhase = function() {
    return GameUI.model.get().currentPhase === 'wordSubmission';
  };

  Template.gameArea.inSelectionPhase = function() {
    return GameUI.model.get().currentPhase === 'wordSelection';
  };

  Template.gameArea.players = function() {
    return GameUI.model.get().players;
  };

  ////

  Template.playArea.iAmCzar = function() {
    var czar = $.grep(GameUI.model.get().players, function(player) {
      return player.isCardCzar;
    })[0];
    return czar && czar.user_id === window.loggedInUser._id;
  };

  Template.playArea.currentBlankType = function() {
    var game = GameUI.model.get();
    return game.adaptedStory.storyChunks[game.currentRound].blank.wordType;
  };

  Template.playArea.currentCards = function() {
    var game = GameUI.model.get();
    return game.adaptedStory.storyChunks[game.currentRound].blank.submissions;
  };

  Template.playArea.winningCard = function() {
    var game = GameUI.model.get();
    return game.adaptedStory.storyChunks[game.currentRound].blank.winningSubmission;
  };

  ////

  Template.storyArea.story_id = function() {
    return GameUI.model.get().story_id;
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

    socket.on('timer started', function(data) {
      console.log("TIMER STARTED: ", data.timerName, data.durationSeconds+" sec");
      // TODO
    });

    socket.on('timer tick', function(data) {
      console.log("TIMER TICK: ", data.timerName, data.remainingSeconds+" sec left");
      // TODO
    });

    socket.on('timer ended', function(data) {
      console.log("TIMER ENDED: ", data.timerName);
      // TODO
    })


    //// DOM Event Handlers ////

    $('#gameArea_parent').on('click', '.select-story', function() {
      socket.emit('select story', { story_id : $(this).data('storyId') });
    });

    $('#gameArea_parent').on('submit', '#chatform', function() {
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


  // DEBUGGING ONLY BELOW -- DO NOT USE IN GAME

  window.DEBUG = {
    // call DEBUG.ping() to see a list on console of connected clients in the same game room
    ping: function() {
      socket.emit('ping');
    },
    timerStart: function(timerName, durationSeconds) {
      socket.emit('timer start', {
        game_id         : window.currentGameId,
        timerName       : timerName,
        durationSeconds : durationSeconds
      });
    },
    timerEnd: function(timerName) {
      socket.emit('timer end', {
        game_id   : window.currentGameId,
        timerName : timerName
      });
    },
    timerCancel: function(timerName) {
      socket.emit('timer cancel', {
        game_id   : window.currentGameId,
        timerName : timerName
      });
    },
    changePhase: function(newPhase) {
      socket.emit('change phase', {
        newPhase : newPhase
      });
    },
    randomizeCzar: function() {
      socket.emit('randomize czar');
    },
    submitWord: function(word) {
      socket.emit('submit word', {
        user_id : window.loggedInUser._id,
        word    : word
      });
    }
  }; // end DEBUG

  socket.on('ping', function() {
    socket.emit('pong', window.loggedInUser);
  });

  socket.on('pong', function(data) {
    console.log("PONG:", data.nickname);
  });

  // DEBUGGING ONLY ABOVE -- DO NOT USE IN GAME


}());