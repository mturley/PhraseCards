module.exports = function(app,passport) {
	app
    .get('/', function(req, res) {
		  res.render('index.ejs');
	   })
<<<<<<< HEAD
    .get('/login', function(req, res) {
		  res.render('login.ejs', { message: req.flash('loginMessage') });
	 })
	.get('/signup', function(req, res) {
			res.render('signup.ejs');
		})

    .get('/about', function(req, res) {
      res.render('about.ejs');
    })
=======
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
			res.render('signup.ejs');
		})
>>>>>>> 081df6793b65cf73f8f8a9bbe25bbd1c0b083cc5
	.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    })
		// process the login form
<<<<<<< HEAD
    .post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
=======
    .post('/', passport.authenticate('local-login', {
		successRedirect : '/lobby', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
>>>>>>> 081df6793b65cf73f8f8a9bbe25bbd1c0b083cc5
		failureFlash : true // allow flash messages
		}))
    .post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
}
