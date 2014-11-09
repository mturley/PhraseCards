var express      = require('express'),
    app          = express(),
    api          = require('./api'),
    path         = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    routes       = require('./app/routes'),
    passport     = require('passport'),
    flash        = require('connect-flash'),
    session      = require('express-session');
    port         = process.env.PORT || 8080;


app.set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(express.static(path.join(__dirname, 'public')))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
   .use(cookieParser())
   .use(session({ secret: 'sessiontest' }))
   .use(passport.initialize())
   .use(passport.session()) // persistent login sessions
   .use(flash()) // use connect-flash for flash messages stored in session
   .use('/api', api);
require('./config/passport')(passport);

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

var io = require('socket.io').listen(app.listen(port));

console.log('Magic happens on port ' + port);

// Chat
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
