var gravatar = require('node-gravatar');

module.exports = function(app,passport) {
  app
    .get('/', function(req, res) {
      res.render('index.ejs', {
      	message: req.flash('loginMessage')
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
    // process the login form
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
