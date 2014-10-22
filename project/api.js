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

router
	.route('/players/:player_id')
		.get(function(req,res){	//get the player given the id
			Player.findById(req.params.player_id,function(err,player){
				if(err)
					res.send(err);
				res.json(player);
			});
		})
		.put(function(req,res){	//remove the player given the id
			Player.findById(req.params.player_id,function(err,player){
				if(err)
					res.send(err);

				player.email = req.body.email;
				player.username = req.body.username;
				
				// save the player
				player.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Player updated!' });
				});
			});
		})
		.delete(function(req,res){	//remove the player given the id
			Player.remove({
				_id: req.params.player_id
			}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
			});
		});



//5446acdfdb16c91faf21cad7

module.exports = router;
