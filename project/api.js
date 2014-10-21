var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	dbURL = require('./config/database.js'),
	db = mongoose.connect(dbURL.url),
	Player = require('./app/models/player'),
	Game = require('./app/models/game'),
	router = express.Router();

router
	.route('/players')//chaining post and get
		.post(function(req, res){
			var player = new Player();
			player.email = req.body.email;
			player.username = req.body.username;
			player.save(function(err){
				if(err)
					res.send(err);
				res.json({message : 'Player created'});
			});
		})
		.get(function(req,res){
			Player.find(function(err,players){
				if(err)
					res.send(err);
				res.json(players);
			})
		});



module.exports = router;
