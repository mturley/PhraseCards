var User = require('./models/user'),
    Game = require('./models/game');

module.exports = function(io) {

  "use strict";

  io.sockets.on('connection', function(socket) {
    // Incoming WebSocket connection from a client
    // Note that `socket` inside this function refers to the open socket connection with a particular user

    var _game_id, _user_id; // global to this connection, will be set in 'join' below if this is a game page

    socket.on('chat message', function(msg) {
      if(_game_id) {
        io.sockets.in(_game_id).emit('chat message', msg);
      }
    });

    socket.on('join', function(data) {
      Game.findById(data.game_id,function(err,game){
        if(game) {
          _game_id = data.game_id
          _user_id = data.user_id

          socket.join(_game_id);
          io.sockets.in(_game_id).emit('joined');

          // TODO: add this player to the game object and save it to the db
          // MIKE LEFT OFF HERE ON 11/23

          // Not sure if we'll need the below block, included for context in case we want it
          // (will need changing if we do include it, do not uncomment as is)
          /*
            // Now, check if everyone is here
            game.players.forEach(function( p ) {
              if ( p.status == 'joined' )
                 pcnt++;
            });

            // If so, update statuses, initialize
            // and notify everyone the game can begin
            if ( pcnt == game.numPlayers ) {
              game.save(function( err, game ) {
                 io.sockets.in( _room ).emit( 'ready' );
              });
            }
          */
        }
      });
    }); // end 'join'

  });

}