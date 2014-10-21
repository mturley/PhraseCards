module.exports = function(app) {
	app
    .get('/', function(req, res) {
		  res.render('index.ejs');
	   })

    .get('/about', function(req, res) {
      res.render('about.ejs');
    });
}
