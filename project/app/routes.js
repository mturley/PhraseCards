module.exports = function(app,passport) {
	app
    .get('/', function(req, res) {
		  res.render('index.ejs');
	   })
    .get('/login', function(req, res) {
		  res.render('login.ejs', { message: req.flash('loginMessage') });
	 })
	.get('/signup', function(req, res) {
			res.render('signup.ejs');
		})

    .get('/about', function(req, res) {
      res.render('about.ejs');
    })
	.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    })
		// process the login form
    .post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
		}))
    .post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
}
