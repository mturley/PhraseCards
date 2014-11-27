var express = require('express'),
    router  = express.Router(),
    User    = require('./models/user'),
    Story   = require('./models/story'),
    Game    = require('./models/game');


router.route('/me').get(function(req, res) {
  if(!req.user) {
    res.status(403).json({ error: "You must log in to use this endpoint" });
  } else {
    res.json(req.user);
  }
});

router
  .route('/users') //chaining post and get
    .post(function(req, res){
      var user = new User();
      user.local.email = req.body.email;
      user.local.username = req.body.username;
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
    .put(function(req,res){ //update the user given the id
      User.findById(req.params.user_id,function(err,user){
        if(err) {
          res.send(err);
        }
        user.local.email = req.body.email;
        user.local.username = req.body.username;

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
      //utilizes wildcard to find nicknames by anything matching given string
      User.find({'local.nickname': {$regex: req.params.name_string, $options: 'i'}}, function (err, users) {
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
            // Initialize Game in the database with default empty-game values
            var game = new Game();
            game.title = reqTitle;
            game.active = true;
            game.maxPlayers = 6;
            game.currentRound = 0;
            game.currentPhase = 'setup';
            game.players = [];
            game.story_id = null;
            game.adaptedStory = null;
            // Save empty game to the database and respond with the new game id
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
      Game.findById(req.params.game_id,function(err,game){
        if(err) {
          res.send(err);
        }
        res.json(game);
      });
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

router
  .route('/stories')
    .get(function(req,res) {
      Story.find(function(err,stories){
        if(err) {
          res.send(err);
        } else {
          res.json(stories);
        }
      });
    });

router
  .route('/stories/:story_id')
    .get(function(req,res) {
      Story.findById(req.params.story_id,function(err,story){
        if(err) {
          res.send(err);
        }
        res.json(story);
      });
    });





router
  .route('/friends/connect/:user_id') //connect the current user and the target user
    .put(function(req,res){
        connectContact(req.headers.user_id, req.params.user_id,res);
        connectContact(req.params.user_id,req.headers.user_id,res);
        res.json({ message: 'Successfully connected' });
    });


router
  .route('/friends/') //get all of the current user's friends
      .get(function(req,res){
        //we get the user's id from the request headers
        User.find({"local.contacts.contact_id" : req.headers.user_id}, function (err, users) {
        if (err) {
          res.send(err);
          }
          res.json(users);
        });

    });


//adds add the second user's contact to the first user's list of contacts
function connectContact(firstUserID, secondUserID,res){

  User.findById(firstUserID,function(err,user){
    if(err) {
      res.send(err);
    }
    var isConnected = false;
    for(i = 0; i < user.local.contacts.length; i++){
      if(user.local.contacts[i].contact_id == secondUserID){
        isConnected = true;
      }
    }

    if(!isConnected){
      user.local.contacts.push({contact_id : secondUserID, isFriend : true});
    }
    // save the user
    user.save(function(err) {
      if (err) {
        res.send(err);
      }
    });
  });
}

module.exports = router;