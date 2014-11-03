module.exports = function(app,passport) {
	app
    .get('/', function(req, res) {
		  res.render('index.ejs', { message: req.flash('loginMessage') });
	   })
    .get('/about', function(req, res) {
      res.render('about.ejs');
    })
		.get('/profile', function(req, res) {
			res.render('profile.ejs');
		})
		.get('/lobby', function(req, res) {
			res.render('lobby.ejs');
		})
		.get('/game', function(req, res) {
			res.render('game.ejs');
		})
		.get('/contact', function(req, res) {
			res.render('contact.ejs');
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
    	console.log('test');
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
}
