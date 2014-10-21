var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res) {

	var mongoose = req.db;

    mongoose.connection.db.collection("usercollection", function (err, collection) {
            collection.find().toArray(function(err, results) {
                res.render('about', { title: 'Express', 'listOfUsers': results });
            });
        });
});

module.exports = router;
