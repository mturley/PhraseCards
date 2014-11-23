module.exports = function(io, db) {

  // Incoming Socket Connections
  io.on('connection', function(socket){
    socket.on('create', function (room) {
      console.log('Joining :' + room);
      socket.join(room);
    });
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });

}