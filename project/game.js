var io;
var gameSocket;


exports.initGame = function(sio, socket){
  io = sio;
  gameSocket = socket;
  gameSocket.emit('connected', { message: "Welcome to PhraseCards!" });
  gameSocket.on('createNewGame', createNewGame);
  gameSocket.on('roomFull', prepareGame);
}

function createNewGame() {
  var gameId = randomId();
  this.emit('newGameCreated', {gameId: gameId, socketId: this.id});
  this.join(gameId.toString());
};

function hostPrepareGame(gameId) {
    var sock = this;
    var data = {
        socketId : sock.id,
        gameId : gameId
    };
    //console.log("All Players Present. Preparing game...");
    io.sockets.in(data.gameId).emit('beginNewGame', data);
}

function randomId() {
  var alphanum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var room = '';
  for(var i = 0; i < 6; i++) {
    room += alphanum.charAt(Math.floor(Math.random() * 62));
  }
  return room;
}
