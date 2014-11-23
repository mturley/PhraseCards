var express      = require('express'),
    app          = express(),
    path         = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    passport     = require('passport'),
    flash        = require('connect-flash'),
    session      = require('express-session'),
    mongodb      = require('mongodb'),
    mongoose     = require('mongoose'),
    dbURL        = require('./config/database.js'),
    db           = mongoose.connect(dbURL.url),
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
   .use('/api', require('./app/api'));

require('./config/passport')(passport);
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

var io = require('socket.io').listen(app.listen(port)); // start the app (http) server and the websocket server
require('./app/sockets.js')(io, db); // set up socket server behavior

console.log('Magic happens on port ' + port);