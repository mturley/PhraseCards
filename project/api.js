var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  dbURL = require('./config/database.js'),
  db = mongoose.connect(dbURL.url),
  User = require('./app/models/user'),
  Game = require('./app/models/game'),
  router = express.Router();


router
  .route('/users')//chaining post and get
    .post(function(req, res){
      var user = new User();
      user.email = req.body.email;
      user.username = req.body.username;
      user.save(function(err){
        if(err)
          res.send(err);
        res.json({message : 'User created'});
      });
    })
    .get(function(req,res){
      User.find(function(err,users){
        if(err)
          res.send(err);
        res.json(users);
      })
    });


router
  .route('/users/:user_id')
    .get(function(req,res){ //get the user given the id
      User.findById(req.params.user_id,function(err,user){
        if(err)
          res.send(err);
        res.json(user);
      });
    })
    .put(function(req,res){ //remove the user given the id
      User.findById(req.params.user_id,function(err,user){
        if(err)
          res.send(err);

        user.email = req.body.email;
        user.username = req.body.username;
        
        // save the user
        user.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'User updated!' });
        });
      });
    })
    .delete(function(req,res){  //remove the user given the id
      User.remove({
        _id: req.params.user_id
      }, function(err, bear) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
      });
    });

router
  .route('/search')
    .get(function(req,res){      
      User.find({ 'local.nickname': req.query['nickname'] }, function (err, users) {
          if (err)
            res.send(err);
          res.render('search.ejs',{
          Users : users
          });
      })
      
    });



//5446acdfdb16c91faf21cad7

module.exports = router;
