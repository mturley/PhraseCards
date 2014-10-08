var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res) {
	var db = req.db;

	var test;
   	var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
    	res.render('about', { title: 'Express', 'listOfUsers': docs });
    });

    
});

module.exports = router;
