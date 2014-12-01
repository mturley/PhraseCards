// sockets.js
// Backend socket.io server code for the game

"use strict";

var gravatar = require('node-gravatar'),
    User     = require('./models/user'),
    Game     = require('./models/game'),
    Story    = require('./models/story');

var Constants = {
  // Durations are in seconds
  SUBMISSION_PHASE_DURATION : 30,
  SELECTION_PHASE_DURATION  : 10,
  REVIEW_PHASE_DURATION     : 5
};

// IMPORTANT NOTE ABOUT DATABASE CONCURRENCY:
//   Any update operations on the Game collection in response to socket events must be performed ATOMICALLY!!
//   This is important so that concurrent player actions (frequent!) do not clobber each other's changes.
//   This means NOT using mongoose's convenient Game.find(..., function(err, game) { ... game.save(); }) pattern.
//   Instead, use Game.findByIdAndUpdate, and use standard mongodb query syntax ($set, $push, etc);
//   http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
var DBHelpers = {
  addPlayerToGame : function(game_id, newPlayer, callback) { // callback takes (err, game)
    // newPlayer must be an object structured as an element of the Game.players array
    // see models/game.js for structure details
    Game.findById(game_id, function(err, game) {
      var playerAlreadyInGame = game.players.some(function(player) {
        return player.user_id === newPlayer.user_id;
      });
      if(playerAlreadyInGame) {
        callback(null, game);
      } else {
        if(game.players.length === 0 && game.currentPhase !== 'setup') {
          newPlayer.isCardCzar = true;
        }
        Game.findByIdAndUpdate(
          game_id,
          {$push: {players: newPlayer}},
          {safe: true, upsert: false},
          callback
        );
      }
    });
  },
  removePlayerFromGame : function(game_id, user_id, callback) { // callback takes (err, game)
    Game.findByIdAndUpdate(
      game_id,
      {$pull: { "players": { user_id: user_id } }},
      {safe: true, upsert: false},
      callback
    );
  },
  adaptStoryObject : function(story) {
    // This function takes a story object as stored in the Story collection of the database,
    // and adds the new fields necessary to assign it to the Game.adaptedStory property.
    // See models/story.js and models/game.js for details about the objects' structure.
    for(var i=0; i<story.storyChunks.length; i++) {
      story.storyChunks[i].blank.submissions = [];
      story.storyChunks[i].blank.winningSubmission = null;
    }
    return story;
  },
  selectStoryForGame : function(game_id, story_id, callback) { // callback takes (err, game)
    Story.findById(story_id, function(err,story) {
      if(err) {
        callback(err, null);
      } else {
        var adaptedStory = DBHelpers.adaptStoryObject(story);
        Game.findByIdAndUpdate(
          game_id,
          {$set: { story_id: story_id, adaptedStory: adaptedStory }},
          {safe: true, upsert: false},
          callback
        );
      }
    });
  },
  setGameRound : function(game_id, newRound, callback) { // callback takes (err, game)
    Game.findByIdAndUpdate(
      game_id,
      {$set: { currentRound : newRound }},
      {safe: true, upsert: false},
      callback
    );
  },
  setGamePhase : function(game_id, newPhase, callback) { // callback takes (err, game)
    Game.findByIdAndUpdate(
      game_id,
      {$set: { currentPhase : newPhase }},
      {safe: true, upsert: false},
      callback
    );
  },
  setGameRoundAndPhase : function(game_id, newRound, newPhase, callback) { // callback takes (err, game)
    Game.findByIdAndUpdate(
      game_id,
      {$set: {
        currentRound : newRound,
        currentPhase : newPhase
      }},
      {safe: true, upsert: false},
      callback
    );
  },
  changeCzarByPlayerIndex : function(game_id, oldCzarIndex, newCzarIndex, callback) { // callback takes (err, game)
    var setFields = {};
    setFields['players.'+newCzarIndex+'.isCardCzar'] = true;
    if(oldCzarIndex !== null && oldCzarIndex !== newCzarIndex) {
      setFields['players.'+oldCzarIndex+'.isCardCzar'] = false;
    }

    Game.findByIdAndUpdate(
      game_id,
      {$set: setFields},
      {safe: true, upsert: false},
      callback
    );
  },
  randomizeCzar : function(game_id, callback) { // callback takes (err, game)
    Game.findById(game_id, function(err, game) {
      var numPlayers = game.players.length;
      var oldCzarIndex = null;
      for(var i=0; i<numPlayers; i++) {
        if(game.players[i].isCardCzar) {
          oldCzarIndex = i;
          break;
        }
      }
      var newCzarIndex = Math.round(Math.random() * (numPlayers - 1));
      DBHelpers.changeCzarByPlayerIndex(game_id, oldCzarIndex, newCzarIndex, callback);
    });
  },
  nextCzar : function(game_id, callback) { // callback takes (err, game)
    Game.findById(game_id, function(err, game) {
      var numPlayers = game.players.length;
      if(numPlayers > 0) {
        var oldCzarIndex = null;
        for(var i=0; i<numPlayers; i++) {
          if(game.players[i].isCardCzar) {
            oldCzarIndex = i;
            break;
          }
        }
        if(oldCzarIndex !== null) {
          var newCzarIndex = (oldCzarIndex + 1) % numPlayers;
          DBHelpers.changeCzarByPlayerIndex(game_id, oldCzarIndex, newCzarIndex, callback);
        } else {
          DBHelpers.randomizeCzar(game_id, callback);
        }
      }
    });
  },
  submitWord : function(game_id, user_id, word, callback) { // callback takes (err, game)
    Game.findById(game_id, function(err, game) {
      var pushFields = {};
      pushFields["adaptedStory.storyChunks."+game.currentRound+".blank.submissions"] = {
        user_id : user_id,
        word    : word
      };
      Game.findByIdAndUpdate(
        game_id,
        {$push: pushFields},
        {safe: true, upsert: false},
        callback
      );
    });
  }
}; // end DbHelpers



//////////////////////////////////////////////////////////////////////////////////////////////////////
////  socket.io-dependent code below in module.exports (passed connection established in app.js)  ////
//////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(io) {

  // The Timers singleton object keeps track of timers for all games, emitting events once a second for each duration.
  // * Call Timers.start(game_id, timerName, durationSeconds, callback) to start a timer
  // * Call Timers.end(game_id, timerName) to stop a timer and call its callback
  // * Call Timers.cancel(game_id, timerName) to stop a timer without calling its callback
  var Timers = {
    timers: {}, // timers[game_id][timerName] = { durationSeconds, remainingSeconds, paused, callback, intervalID }
    start: function(game_id, timerName, durationSeconds, callback) {
      if(!this.timers[game_id]) {
        // If we don't already have a timers dictionary for this game, create one
        this.timers[game_id] = {};
      }
      if(!this.timers[game_id][timerName]) {
        // If we don't already have a timer running for this game with this name, start one
        // (we can call Timers.start with the same name multiple times and only get one timer)
        io.sockets.in(game_id).emit('timer started', {
          timerName       : timerName,
          durationSeconds : durationSeconds
        });
        var timer = this.timers[game_id][timerName] = {};
        timer.durationSeconds = durationSeconds;
        timer.remainingSeconds = durationSeconds;
        timer.paused = false;
        timer.callback = callback;
        timer.intervalID = setInterval(function() {
          if(!timer.paused) {
            timer.remainingSeconds--;
            io.sockets.in(game_id).emit('timer tick', {
              timerName        : timerName,
              durationSeconds  : timer.durationSeconds,
              remainingSeconds : timer.remainingSeconds
            });
            if(timer.remainingSeconds <= 0) {
              Timers.end(game_id, timerName);
            }
          }
        }, 1000);
      }
    },
    end: function(game_id, timerName) {
      if(this.timers[game_id] && this.timers[game_id][timerName]) {
        var timer = this.timers[game_id][timerName];
        clearInterval(timer.intervalID);
        timer.callback();
        Timers.cancel(game_id, timerName);
      }
    },
    cancel: function(game_id, timerName) {
      if(this.timers[game_id] && this.timers[game_id][timerName]) {
        var timer = this.timers[game_id][timerName];
        clearInterval(timer.intervalID); // may be redundant, but if already cleared this is a no-op
        io.sockets.in(game_id).emit('timer ended', {
          timerName : timerName
        });
        delete this.timers[game_id][timerName];
        if(Object.keys(this.timers[game_id]).length === 0) {
          delete this.timers[game_id];
        }
      }
    },
    cancelAll: function(game_id) {
      if(this.timers[game_id]) {
        Object.keys(this.timers[game_id]).forEach(function(timerName) {
          Timers.cancel(game_id, timerName);
        });
      }
    },
    pause: function(game_id, timerName) {
      if(this.timers[game_id] && this.timers[game_id][timerName]) {
        this.timers[game_id][timerName].paused = true;
      }
    },
    pauseAll: function(game_id) {
      if(this.timers[game_id]) {
        Object.keys(this.timers[game_id]).forEach(function(timerName) {
          Timers.pause(game_id, timerName);
        });
      }
    },
    resume: function(game_id, timerName) {
      if(this.timers[game_id] && this.timers[game_id][timerName]) {
        this.timers[game_id][timerName].paused = false;
      }
    },
    resumeAll: function(game_id) {
      if(this.timers[game_id]) {
        Object.keys(this.timers[game_id]).forEach(function(timerName) {
          Timers.resume(game_id, timerName);
        });
      }
    }
  };


  var GameManager = {
    startNextRound: function(game_id) {
      Game.findById(game_id, function(err, game) {
        var newRound = (game.currentRound === null ? 0 : game.currentRound + 1);
        if(newRound >= game.adaptedStory.storyChunks.length) {
          GameManager.endGame(game_id);
        } else {
          DBHelpers.nextCzar(game_id, function() {
            DBHelpers.setGameRoundAndPhase(game_id, newRound, 'wordSubmission', function(err, game) {
              io.sockets.in(game_id).emit('game state changed', game);
              io.sockets.in(game_id).emit('czar changed');
              Timers.start(game_id, 'wordSubmission', Constants.SUBMISSION_PHASE_DURATION, function() {
                // TODO check if there are no submitted words, if so, wait until one is submitted first?
                GameManager.startSelectionPhase(game_id);
              });
            });
          });
        }
      });
    },
    startSelectionPhase: function(game_id) {
      DBHelpers.setGamePhase(game_id, 'wordSelection', function(err, game) {
        io.sockets.in(game_id).emit('game state changed', game);
        Timers.start(game_id, 'wordSelection', Constants.SELECTION_PHASE_DURATION, function() {
          // TODO check if there's a winning word, if not, select one randomly first
          GameManager.startReviewPhase(game_id);
        });
      });
    },
    startReviewPhase: function(game_id) {
      DBHelpers.setGamePhase(game_id, 'review', function(err, game) {
        io.sockets.in(game_id).emit('game state changed', game);
        // TODO award points to the submitter of the winning word
        Timers.start(game_id, 'review', Constants.REVIEW_PHASE_DURATION, function() {
          GameManager.startNextRound(game_id);
        });
      });
    },
    endGame: function(game_id) {
      DBHelpers.setGameRoundAndPhase(game_id, null, 'end', function(err, game) {
        io.sockets.in(game_id).emit('game state changed', game);
      });
    }
  };




  /////////////////////////////////////////////////////////////////////////////
  ////                     SOCKET EVENT HANDLERS BELOW                     ////
  /////////////////////////////////////////////////////////////////////////////




  io.sockets.on('connection', function(socket) {
    // Incoming WebSocket connection from a client
    // Note that `socket` inside this function refers to the open socket connection with a particular user

    var _game_id, _user_id; // global to this connection, will be set in 'join' below

    socket.on('chat message', function(data) {
      if(_game_id) {
        io.sockets.in(_game_id).emit('chat message', data);
      }
    });

    socket.on('join', function(data) {
      Game.findById(data.game_id,function(err,game) {
        if(game) {
          _game_id = data.game_id
          _user_id = data.user_id

          socket.join(_game_id);

          if(game.players.length >= game.maxPlayers) {
            socket.emit('join failed', 'Room is Full');
          } else {
            var newPlayer = {
              user_id    : _user_id,
              nickname   : data.nickname,
              avatar     : data.avatar,
              status     : 'joined',
              statusDate : Date.now(),
              score      : 0,
              isCardCzar : false
            };

            DBHelpers.addPlayerToGame(_game_id, newPlayer, function(err, game) {
              io.sockets.in(_game_id).emit('game state changed', game);
              io.sockets.in(_game_id).emit('player joined', {
                user_id  : newPlayer.user_id,
                nickname : newPlayer.nickname,
                avatar   : newPlayer.avatar
              });
            });
          }

        } else {
          socket.emit('join failed', 'No Such Room');
        }
      });
    }); // end socket.on('join')

    socket.on('select story', function(data) {
      DBHelpers.selectStoryForGame(_game_id, data.story_id, function(err, game) {
        io.sockets.in(_game_id).emit('game state changed', game);
      });
    });

    socket.on('start game', function() {
      Game.findById(_game_id, function(err, game) {
        if(game.currentPhase === 'setup') {
          GameManager.startNextRound(_game_id);
        }
      });
    });

    socket.on('change phase', function(data) {
      DBHelpers.setGamePhase(_game_id, data.newPhase, function(err, game) {
        io.sockets.in(_game_id).emit('game state changed', game);
      });
    });

    socket.on('randomize czar', function() {
      DBHelpers.randomizeCzar(_game_id, function(err, game) {
        io.sockets.in(_game_id).emit('game state changed', game);
        io.sockets.in(_game_id).emit('czar changed');
      });
    });

    socket.on('submit word', function(data) {
      DBHelpers.submitWord(_game_id, data.user_id, data.word, function(err, game) {
        io.sockets.in(_game_id).emit('game state changed', game);
      });
    });

    socket.on('disconnect', function(data) {
      socket.leave(_game_id);
      // remove this player from the game in the database, and emit a state update!
      DBHelpers.removePlayerFromGame(_game_id, _user_id, function(err, game) {
        io.sockets.in(_game_id).emit('game state changed', game);
        User.findById(_user_id, function(err, userObject) {
          if(userObject) io.sockets.in(_game_id).emit('player left', {
            user_id  : userObject._id,
            nickname : userObject.local.nickname,
            avatar   : gravatar.get(userObject.local.email)
          });
        });
        var gameHasCzar = game.players.filter(function(player) {
          return player.isCardCzar;
        }).length > 0;
        if(!gameHasCzar) {
          // the player who left was the czar, we need a new one
          DBHelpers.nextCzar(_game_id, function(err, game) {
            io.sockets.in(_game_id).emit('game state changed', game);
            io.sockets.in(_game_id).emit('czar changed');
          });
        }
      });
    }); // end socket.on('disconnect')


    // DEBUGGING ONLY BELOW -- DO NOT USE IN GAME

    socket.on('timer start', function(data) {
      Timers.start(_game_id, data.timerName, data.durationSeconds, function() {
        console.log("DING DING DING: ", data.timerName, "in game", _game_id);
      });
    });

    socket.on('timer end', function(data) {
      Timers.end(_game_id, data.timerName);
      console.log("TIMER ENDED", data.timerName, "in game", _game_id);
    });

    socket.on('timer cancel', function(data) {
      Timers.cancel(_game_id, data.timerName);
      console.log("TIMER CANCELLED", data.timerName, "in game", _game_id);
    });

    socket.on('timer pause all', function() {
      Timers.pauseAll(_game_id);
    });

    socket.on('timer resume all', function() {
      Timers.resumeAll(_game_id);
    });

    socket.on('ping', function() {
      io.sockets.in(_game_id).emit('ping');
    });

    socket.on('pong', function(data) {
      io.sockets.in(_game_id).emit('pong', data);
    });

    socket.on('reset game', function() {
      Timers.cancelAll(_game_id);
      Game.findByIdAndUpdate(
        _game_id,
        {$set: {
          currentRound : null,
          currentPhase : 'setup',
          story_id     : null,
          adaptedStory : null
        }},
        {safe: true, upsert: false},
        function(err, game) {
          io.sockets.in(_game_id).emit('game state changed', game);
        }
      );
    });

    // DEBUGGING ONLY ABOVE -- DO NOT USE IN GAME

  }); // end io.sockets.on('connection')

}; // end module.exports
