module.exports = function(app,passport) {
	app
    .get('/', function(req, res) {
		  res.render('index.ejs', { message: req.flash('loginMessage') });
	   })

    .get('/about', function(req, res) {
      res.render('about.ejs');
    })

		.get('/signup', function(req, res) {
			res.render('signup.ejs');
		})

		// process the login form
    .post('/', passport.authenticate('local-login', {
successRedirect : '/about', // redirect to the secure profile section
failureRedirect : '/', // redirect back to the signup page if there is an error
failureFlash : true // allow flash messages
}));
}
