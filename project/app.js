var express = require('express'),
    api = require('./api'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./app/routes'),
    port           = process.env.PORT || 8080;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('./api', api);
require('./app/routes.js')(app);

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;
