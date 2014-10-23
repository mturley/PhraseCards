var express      = require('express'),
    app          = express(),
    api          = require('./api'),
    path         = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    routes       = require('./app/routes'),
    port         = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(express.static(path.join(__dirname, 'public')))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
   .use(cookieParser())
   .use('/api', api);

require('./app/routes.js')(app);

app.listen(port);
console.log('Magic happens on port ' + port);
