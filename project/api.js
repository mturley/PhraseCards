var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
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


//5446abfd63c97dd4ae28f021

module.exports = router;
