// sockets.js
// Backend socket.io server code for the game

"use strict";

var gravatar = require('node-gravatar'),
    User     = require('./models/user'),
    Game     = require('./models/game'),
    Story    = require('./models/story');

var DBHelpers = {
  addPlayerToGame : function(game_id, newPlayer, callback) { // callback takes (err, game)
    // newPlayer must be an object structured as an element of the Game.players array
    // see models/game.js for structure details
    // (using findByIdAndUpdate instead of game fields and game.save() in case of race conditions)
    Game.findById(game_id, function(err, game) {
      var playerAlreadyInGame = game.players.some(function(player) {
        return player.user_id === newPlayer.user_id;
      });
      if(playerAlreadyInGame) {
        callback(null, game);
      } else {
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
  selectStoryForGame : function(game_id, story_id, callback) {
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
  changeGamePhase : function(game_id, newPhase, callback) {
    // TODO
  }
};

module.exports = function(io) {

  io.sockets.on('connection', function(socket) {
    // Incoming WebSocket connection from a client
    // Note that `socket` inside this function refers to the open socket connection with a particular user

    var _game_id, _user_id; // global to this connection, will be set in 'join' below if this is a game page

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
      });

    }); // end socket.on('disconnect')

    socket.on('ping', function() {
      io.sockets.in(_game_id).emit('ping');
    });

    socket.on('pong', function(data) {
      io.sockets.in(_game_id).emit('pong', data);
    });

  }); // end io.sockets.on('connection')

}; // end module.exports
