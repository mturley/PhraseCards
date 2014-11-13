var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  dbURL = require('./config/database.js'),
  db = mongoose.connect(dbURL.url),
  User = require('./app/models/user'),
  Game = require('./app/models/game'),
  router = express.Router();

router
  .route('/users') //chaining post and get
    .post(function(req, res){
      var user = new User();
      user.email = req.body.email;
      user.username = req.body.username;
      user.save(function(err){
        if(err) {
          res.send(err);
        }
        res.json({message : 'User created'});
      });
    })
    .get(function(req,res){
      User.find(function(err,users){
        if(err) {
          res.send(err);
        }
        Users = JSON.stringify(users);
       res.json(users);
      });
    });


router
  .route('/users/:user_id')
    .get(function(req,res){ //get the user given the id
      User.findById(req.params.user_id,function(err,user){
        if(err) {
          res.send(err);
        }
        res.json(user);
      });
    })
    .put(function(req,res){ //remove the user given the id
      User.findById(req.params.user_id,function(err,user){
        if(err) {
          res.send(err);
        }
        user.email = req.body.email;
        user.username = req.body.username;
        
        // save the user
        user.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'User updated!' });
        });
      });
    })
    .delete(function(req,res){  //remove the user given the id
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
      });
    });

router
  .route('/search/:name_string')
    .get(function(req,res){      
      User.find({ 'local.nickname': req.params.name_string }, function (err, users) {
        if (err) {
          res.send(err);
        }
          res.json(users);
      });
      
    });

// Game/Room/Lobby related API stuff below

router
  .route('/games')
    .get(function(req,res) {
      // Get a list of games (used on lobby page)
      Game.find(function(err,games){
        if(err) {
          res.send(err);
        } else {
          res.json(games);
        }
      });
    })
    .post(function(req,res) {
      // Create a new game (used on lobby page)
      var reqTitle = req.body.title;
      if(!reqTitle || reqTitle === '') {
        res.status(400).send("Invalid Request: Game title required");
        return;
      }
      Game.where({ active: true, title: reqTitle }).count(function (err, count) {
        if(err) {
          res.send(err);
        } else {
          if(count !== 0) {
            res.json({ success: false, message: "An active game room with that name already exists" });
          } else {
            var game = new Game();
            game.title = reqTitle;
            game.active = true;
            game.currentRound = 0;
            game.currentPhase = 'setup';
            game.players = [];
            game.story_id = null;
            game.save(function (err, savedGame) {
              if(err) {
                res.send(err);
              } else {
                res.json({ success: true, game_id: savedGame._id });
              }
            });
          }
        }
      });
    });

router
  .route('/games/:game_id')
    .get(function(req,res) {
      // Get a particular game's object
      // TODO determine what data is loaded based on who is requesting??
      var gameId = req.params.game_id;
      res.json({ todo: "testing, get game with id: "+gameId});
      // TODO fetch game details
    })
    .put(function(req,res) {
      var gameId = req.params.game_id;
      res.json({ todo: "testing, update game with id: "+gameId});
      // TODO update game details
    })
    .delete(function(req,res) {
      Game.remove({
        _id: req.params.game_id
      }, function(err, game) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
      });
    });

//5446acdfdb16c91faf21cad7

module.exports = router;
