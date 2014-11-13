var gravatar = require('node-gravatar');
var http = require('http');
var url = require('url');

module.exports = function(app,passport) {
  app
    .get('/', function(req, res) {

      var URL = url.parse("http://localhost:8080/api/users");
      var options = {
        host: URL.hostname,
        path: URL.path,
        port: URL.port,
        method: 'GET'
      };
    
    var userReq = http.request(options, function(resp) {
      resp.setEncoding('utf8');
      resp.on('data', function(data){
      console.log(data);
    });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
    userReq.end();


    res.render('index.ejs', {
        message: req.flash('loginMessage'),
      });
    })
    .get('/profile', isLoggedIn, function(req, res) {
      res.render('profile.ejs', {
        // get the user out of session and pass to template
        user : req.user,
        avatar : gravatar.get(req.user.local.email)
      });
    })
    .get('/lobby', isLoggedIn, function(req, res) {
      res.render('lobby.ejs', {
        user : req.user,
        avatar : gravatar.get(req.user.local.email),
        pageName : 'lobby',
        usingBlaze : true
      });
    })
    .get('/story', function(req, res) {
      res.render('story_picker.ejs', {
      });
    })
    .get('/game', function(req, res) {
      // TODO remove this temporary   route, it's just for frontend viewing in no particular game
      res.redirect('/game/somegameidgoeshere');
    })
    .get('/game/:game_id', isLoggedIn, function(req, res) {
      res.render('game.ejs', {
        user : req.user,
        avatar : gravatar.get(req.user.local.email),
        game_id : req.params.game_id,
        pageName : 'game',
        usingBlaze : true
      });
    })
    .get('/czar', isLoggedIn, function(req, res) {
      res.render('game_czar_view.ejs', {
        user : req.user,
        avatar : gravatar.get(req.user.local.email)
      });
    })
    .get('/signup', function(req, res) {
      res.render('signup.ejs', { message: req.flash('signupMessage') });
    })
    .get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    })
//     .post('/start_game', function (req, res) {

//       var room    = randomId(),
//           pid     = randomId(),
//           num     = 6,   // STATIC CHANGE!!!!
//           players = [{
//             user_id    : req.user._id,
//             score      : 0,
//             isCardCzar : false
//             status     : 'joined',
//             statusDate : Date.now()
//           }];

//       for(var i=1; i<num; i++) {
//         players.push({
//           id           : req.user._id + '-' + i,
//           score        : 0,
//           isCardCzar   : false
//           status       : 'open',
//           statusDate   : Date.now()
//         });
//       }

//       Game.create({
//         title          : req.body.title,
//         active         : true,
//         currentRound   : 0,
//         currentPhase   : 'waiting',
//         room           : room,
//         numPlayers     : num,
//         players        : players,
//         rounds         : [],
//         story_id       : 1   // STATIC CHANGE!!!!
//       },

//       function( err, game ) {
//          var data = game.toJSON();
//          data.action = 'start';
//          data.player = req.user._id;
//          res.send( data );
//       });
//     })
//     // process the login form
    .post('/', passport.authenticate('local-login', {
      successRedirect : '/lobby', // redirect to the secure profile section
      failureRedirect : '/', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }))
    .post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/lobby', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
}


function randomId(req, res, next) {
  var alphanum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var room = '';
  for(var i = 0; i < 6; i++) {
    room += alphanum.charAt(Math.floor(Math.random() * 62));
  }
  return room;
}
