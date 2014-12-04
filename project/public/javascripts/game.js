// game.js
// Frontend UI code for the /game page only

(function() {

  "use strict";


  /////////////////////////////////////////////////////////////////////////////
  //  _   _ ___    ____    _  _____  _       __  __  ___  ____  _____ _      //
  // | | | |_ _|  |  _ \  / \|_   _|/ \     |  \/  |/ _ \|  _ \| ____| |     //
  // | | | || |   | | | |/ _ \ | | / _ \    | |\/| | | | | | | |  _| | |     //
  // | |_| || |   | |_| / ___ \| |/ ___ \   | |  | | |_| | |_| | |___| |___  //
  //  \___/|___|  |____/_/   \_\_/_/   \_\  |_|  |_|\___/|____/|_____|_____| //
  //                                                                         //
  /////////////////////////////////////////////////////////////////////////////

  var GameUI = {
    model: new Blaze.Var({
      title        : '',
      owner        : null,
      active       : true,
      currentRound : null,
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
    getWinningPlayerThisRound: function() {
      var game = this.model.get();
      if(!game.adaptedStory || game.currentRound === null) return null;
      var winningCard = game.adaptedStory.storyChunks[game.currentRound].blank.winningSubmission;
      if(!winningCard) return null;
      var matchingPlayers = game.players.filter(function(player) {
        return player.user_id === winningCard.user_id;
      });
      if(matchingPlayers.length < 1) return null;
      return matchingPlayers[0];
    },
    getTopScoringPlayer: function() {
      var players = GameUI.model.get().players;
      var topScorer = { score: 0 };
      for(var i = 0; i < players.length; i++){
        if(players[i].score > topScorer.score){
          topScorer = players[i];
        }
      }
      return topScorer;
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
    },
    timer: null,
    updateTimer: function(remainingSeconds, durationSeconds) {
      if(this.timer === null) {
        var element = $("#timer-container").get(0);
        this.timer = new ProgressBar.Circle(element, {
          duration: 200,
          color: "#008CBA",
          trailColor: "#45ACF1",
          strokeWidth: 8
        });
      }
      this.timer.animate(remainingSeconds / durationSeconds, function() {
        $("#clock-seconds").html(remainingSeconds);
      });
    },
    destroyTimer: function() {
      if(this.timer) {
        this.timer.destroy();
        this.timer = null;
      }
    }
  };

  GameUI.reloadStories();







  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //  _____ _____ __  __ ____  _        _  _____ _____    _   _ _____ _     ____  _____ ____  ____    //
  // |_   _| ____|  \/  |  _ \| |      / \|_   _| ____|  | | | | ____| |   |  _ \| ____|  _ \/ ___|   //
  //   | | |  _| | |\/| | |_) | |     / _ \ | | |  _|    | |_| |  _| | |   | |_) |  _| | |_) \___ \   //
  //   | | | |___| |  | |  __/| |___ / ___ \| | | |___   |  _  | |___| |___|  __/| |___|  _ < ___) |  //
  //   |_| |_____|_|  |_|_|   |_____/_/   \_\_| |_____|  |_| |_|_____|_____|_|   |_____|_| \_\____/   //
  //                                                                                                  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////

  //// Blaze Template Helpers ////

  Template.sidebar.players = function() {
    return GameUI.model.get().players;
  };

  Template.sidebar.currentRound = function() {
    var round = GameUI.model.get().currentRound;
    if(round !== null) return round + 1;
    return null;
  };

  Template.sidebar.numRounds = function() {
    return GameUI.model.get().adaptedStory.storyChunks.length;
  };

  ////

  Template.gameArea.inSetupPhase = function() {
    return GameUI.model.get().currentPhase === 'setup';
  };

  Template.gameArea.inEndPhase = function() {
    return GameUI.model.get().currentPhase === 'end';
  };

  Template.gameArea.players = function() {
    return GameUI.model.get().players;
  };

  Template.gameArea.destroyed = function() {
    GameUI.destroyTimer();
  };

  ////

  Template.waitingArea.notEnoughPlayers = function() {
    var game = GameUI.model.get();
    return game.players.length < game.minPlayers;
  };

  Template.waitingArea.playersNeeded = function() {
    var game = GameUI.model.get();
    var numNeeded = game.minPlayers - game.players.length;
    var plural = "";
    if(numNeeded > 1) plural = "s";
    return "We need at least "+numNeeded+" more player"+plural+" to start";
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

  Template.waitingArea.storyName = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory) return '';
    return game.adaptedStory.name;
  };

  ////

  Template.playArea.inSubmissionPhase = function() {
    return GameUI.model.get().currentPhase === 'wordSubmission';
  };

  Template.playArea.inSelectionPhase = function() {
    return GameUI.model.get().currentPhase === 'wordSelection';
  };

  Template.playArea.inReviewPhase = function() {
    return GameUI.model.get().currentPhase === 'review';
  };

  Template.playArea.iAmCzar = function() {
    var czar = $.grep(GameUI.model.get().players, function(player) {
      return player.isCardCzar;
    })[0];
    return czar && czar.user_id === window.loggedInUser._id;
  };

  Template.playArea.iSubmittedACard = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return false;
    var matches = game.adaptedStory.storyChunks[game.currentRound].blank.submissions.filter(function(submission) {
      return submission.user_id === window.loggedInUser._id;
    });
    return matches.length > 0;
  }

  Template.playArea.currentStoryChunkPrefix = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return '';
    return game.adaptedStory.storyChunks[game.currentRound].prefix;
  };

  Template.playArea.currentStoryChunkSuffix = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return '';
    return game.adaptedStory.storyChunks[game.currentRound].suffix;
  };

  Template.playArea.currentBlankType = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return '';
    return game.adaptedStory.storyChunks[game.currentRound].blank.wordType;
  };

  Template.submittedCards.currentCards = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return [];
    return game.adaptedStory.storyChunks[game.currentRound].blank.submissions;
  };

  Template.cardSelectionForm.currentCards = Template.submittedCards.currentCards;

  Template.playArea.winningCard = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return null;
    var card = game.adaptedStory.storyChunks[game.currentRound].blank.winningSubmission;
    return (card ? card.word : '');
  };

  Template.reviewArea.winningAvatar = function() {
    var player = GameUI.getWinningPlayerThisRound();
    return (player ? player.avatar : '');
  };

  Template.reviewArea.winningPlayerName = function() { // winner of the current round!
    var player = GameUI.getWinningPlayerThisRound();
    return (player ? player.nickname : '');
  };

  Template.reviewArea.winningCard = Template.playArea.winningCard;

  ////

  Template.storyArea.story_id = function() {
    return GameUI.model.get().story_id;
  };

  Template.storyArea.currentStory = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return [];
    return game.adaptedStory.storyChunks;
  };

  Template.storyArea.currentStorySoFar = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return [];
    return game.adaptedStory.storyChunks.slice(0,game.currentRound+1);
  };

  Template.storyArea.currentStoryChunk = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return false;
    if(game.adaptedStory.storyChunks[game.currentRound]._id === this._id) return true;
  };

  Template.storyArea.currentRound = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory || game.currentRound === null) return '';
    return game.currentRound + 1;
  };

  Template.storyArea.currentStoryName = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory) return '';
    return game.adaptedStory.name;
  };

  ////

  Template.endArea.winningPlayerName = function() { // winner of the whole game!
    return GameUI.getTopScoringPlayer().nickname;
  };

  Template.endArea.winningScore = function() {
    return GameUI.getTopScoringPlayer().score;
  };

  Template.endArea.storyName = function() {
    var game = GameUI.model.get();
    if(!game.adaptedStory) return '';
    return game.adaptedStory.name;
  };

  Template.endArea.storyChunks = Template.storyArea.currentStory;









  ///////////////////////////////////////////////////////////////////////////
  //  ____   ___   ____ _  _______ _____    ____  _____ _____ _   _ ____   //
  // / ___| / _ \ / ___| |/ / ____|_   _|  / ___|| ____|_   _| | | |  _ \  //
  // \___ \| | | | |   | ' /|  _|   | |    \___ \|  _|   | | | | | | |_) | //
  //  ___) | |_| | |___| . \| |___  | |     ___) | |___  | | | |_| |  __/  //
  // |____/ \___/ \____|_|\_\_____| |_|    |____/|_____| |_|  \___/|_|     //
  //                                                                       //
  ///////////////////////////////////////////////////////////////////////////



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







  ////////////////////////////////////////////////////////////
  //  ____   ___  __  __    ____  _____    _    ______   __ //
  // |  _ \ / _ \|  \/  |  |  _ \| ____|  / \  |  _ \ \ / / //
  // | | | | | | | |\/| |  | |_) |  _|   / _ \ | | | \ V /  //
  // | |_| | |_| | |  | |  |  _ <| |___ / ___ \| |_| || |   //
  // |____/ \___/|_|  |_|  |_| \_\_____/_/   \_\____/ |_|   //
  //                                                        //
  ////////////////////////////////////////////////////////////



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






    ////////////////////////////////////////////////////////////////////////////////////////////
    //  _______     _______ _   _ _____    _   _    _    _   _ ____  _     _____ ____  ____   //
    // | ____\ \   / / ____| \ | |_   _|  | | | |  / \  | \ | |  _ \| |   | ____|  _ \/ ___|  //
    // |  _|  \ \ / /|  _| |  \| | | |    | |_| | / _ \ |  \| | | | | |   |  _| | |_) \___ \  //
    // | |___  \ V / | |___| |\  | | |    |  _  |/ ___ \| |\  | |_| | |___| |___|  _ < ___) | //
    // |_____|  \_/  |_____|_| \_| |_|    |_| |_/_/   \_\_| \_|____/|_____|_____|_| \_\____/  //
    //                                                                                        //
    ////////////////////////////////////////////////////////////////////////////////////////////


    //// DOM-Dependent Socket Message Handlers ////

    socket.on('join failed', function(reason) {
      // TODO alert user that they couldn't join, and either leave or use spectator mode
      if(reason === 'No Such Room') {
        alert("No Such Game!");
        document.location = "/lobby";
      } else if(reason === 'Room is Full') {
        alert("This room is full!");
        document.location = "/lobby";
      }
    });

    socket.on('player joined', function(data) {
      console.log("Player Joined: ", data);
      // TODO alert that a player has joined the game
      $('.alert_parent').append('<div data-alert class="alert-box info radius animated zoomIn">' + data.nickname + ' joined the room.<a href="#" class="close">&times;</a></div>');
      setTimeout(function(){$('.alert-box').hide();}, 6000);
    });

    socket.on('player left', function(data) {
      console.log("Player Left: ", data);
      // TODO alert that a player has left the game
      $('.alert_parent').append('<div data-alert class="alert-box info radius animated zoomIn">' + data.nickname + ' left the room.<a href="#" class="close">&times;</a></div>');
      setTimeout(function(){$('.alert-box').hide();}, 6000);
    });

    socket.on('chat message', function(data) {
      var $chatContainer = $('#chat_container');
      $chatContainer.append('<div class="chat_row animated zoomIn"><img src="' + data.avatar + '" alt="" class="round_img" />  '+ data.nickname + ': ' + data.message + "</div>");
      var element = $chatContainer.get(0);
      element.scrollTop = element.scrollHeight;
    });

    socket.on('timer started', function(data) {
      console.log("TIMER STARTED: ", data.timerName, data.durationSeconds+" sec");
      GameUI.updateTimer(data.durationSeconds, data.durationSeconds);
    });

    socket.on('timer tick', function(data) {
      console.log("TIMER TICK: ", data.timerName, data.remainingSeconds+" sec left");
      GameUI.updateTimer(data.remainingSeconds, data.durationSeconds);
    });

    socket.on('timer ended', function(data) {
      console.log("TIMER ENDED: ", data.timerName);
      // TODO
    })


    //// DOM Event Handlers ////

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

    $('#gameArea_parent').on('click', '.select-story', function() {
      socket.emit('select story', { story_id : $(this).data('storyId') });
    });

    $('#gameArea_parent').on('click', '.start-game', function() {
      if(Template.gameArea.inSetupPhase() && Template.waitingArea.gameReady()) {
        socket.emit('start game');
      }
    });

    $('#gameArea_parent').on('submit', '#card-submission-form', function(event) {
      event.preventDefault();
      var $input = $("#card-input");
      var word = $input.val();
      if(word !== '') {
        $input.attr('disabled','disabled');
        $input.val('');
        socket.emit('submit word', {
          user_id : window.loggedInUser._id,
          word    : word
        });
      }
    });

    $('#gameArea_parent').on('click', 'a.selectCard', function(event) {
      event.preventDefault();
      var submissionId = $(this).data('submissionId');
      socket.emit('select word', {
        submissionId: submissionId
      });
    });

  }); // end document ready







  /////////////////////////////////////
  //  ____  _____ ____  _   _  ____  //
  // |  _ \| ____| __ )| | | |/ ___| //
  // | | | |  _| |  _ \| | | | |  _  //
  // | |_| | |___| |_) | |_| | |_| | //
  // |____/|_____|____/ \___/ \____| //
  //                                 //
  /////////////////////////////////////

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
    timerPause: function() {
      socket.emit('timer pause all');
    },
    timerResume: function() {
      socket.emit('timer resume all');
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
    },
    resetGame: function() {
      socket.emit('reset game');
    },
  }; // end DEBUG

  socket.on('ping', function() {
    socket.emit('pong', window.loggedInUser);
  });

  socket.on('pong', function(data) {
    console.log("PONG:", data.nickname);
  });

  // DEBUGGING ONLY ABOVE -- DO NOT USE IN GAME


}());


//  _____________________
// < believe in yourself >
//  ---------------------
//         \   ^__^
//          \  (oo)\_______
//             (__)\       )\/\
//                 ||----w |
//                 ||     ||
//
