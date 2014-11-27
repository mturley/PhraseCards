var gravatar = require('node-gravatar');
var http = require('http');
var url = require('url');

// TODO  need a better way to get hostname rather than hardcode
var hostname = "http://localhost:8080";

module.exports = function(app,passport) {
  app
    .get('/', function(req, res) {
      if (req.isAuthenticated()){
          res.redirect('/lobby');
        }else{
          res.render('index.ejs', {
            message: req.flash('loginMessage'),
          });
        }
    })
    .get('/search', isLoggedIn, function(req, res) {
      var HTTPOptions = getHTTPOptions("/api/search/"+ req.query['name_string'], 'GET',{'user_id': req.user._id});
      getObjects(HTTPOptions, function(userList){
        res.render('search.ejs', {Users : userList});
      });
    })
    /*
    //Search all users
    //Check what query on empty string returns
    .get('/searchAll', isLoggedIn, function(req, res) {
      var userReq = http.request(getHTTPOptions(hostname + "/api/search/"+ req.query[''], 'GET'), function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function(data){
        var userList = JSON.parse(data);
           res.render('search.ejs', {Users : userList
      });
      });
    }).on('error', function(e) {console.log("Got error: " + e.message);});
      userReq.end();
    })
    */
    .get('/profile', isLoggedIn, function(req, res) {
      var HTTPOptions = getHTTPOptions("/api/friends/", 'GET',{'user_id': req.user._id});
      getObjects(HTTPOptions, function(friendObjects){
        HTTPOptions = getHTTPOptions("/api/users/", 'GET', undefined);
        //the list of all of the users
        getObjects(HTTPOptions, function(searchUserObjects){
          var friendAvatarList = [];
          for(i = 0; i< friendObjects.length; i++){
            friendAvatarList.push(gravatar.get(friendObjects[i].local.email))
          }

          var searchUserAvatarsList = [];
          for(i = 0; i< searchUserObjects.length; i++){
            searchUserAvatarsList.push(gravatar.get(searchUserObjects[i].local.email))
          }
          //console.log(searchUserObjects)

          // Only Send non-friends to profile find friends
          var non_friends = [];
          for(i = 0; i< searchUserObjects.length; i++){
            if (friendObjects.indexOf(searchUserObjects[i].local._id)){
              non_friends.push(searchUserObjects[i]);
            }
          }

          res.render('profile.ejs', {
            // get the user out of session and pass to template
            searchUsers : non_friends,
            searchUserAvatars : searchUserAvatarsList,
            user : req.user,
            avatar : gravatar.get(req.user.local.email),
            friends : friendObjects,
            friendAvatars : friendAvatarList
          });
        });
      });
    })//Gives out the profile of the following user
      //TODO Needs a better way of getting user profile
    .get('/profile/:user_id', isLoggedIn, function(req, res) {
      var HTTPOptions = getHTTPOptions("/api/users/"+req.params.user_id, 'GET',  {'user_id': req.user._id});
      //first get the user
     getObjects(HTTPOptions, function(userObject){
      //then get the friends of that user
      var HTTPOptions = getHTTPOptions("/api/friends/", 'GET',{'user_id': req.params.user_id});
      getObjects(HTTPOptions, function(friendObjects){

        friendAvatarList = [];
        for(i = 0; i< friendObjects.length; i++){
          friendAvatarList.push(gravatar.get(friendObjects[i].local.email))
        }
        res.render('userProfile.ejs', {
        // get the userObject
        user : userObject,
        avatar : gravatar.get(userObject.local.email),
        friends : friendObjects,
        friendAvatars : friendAvatarList
        });
      });
    });

    })
    .get('/lobby', isLoggedIn, function(req, res) {
      res.render('lobby.ejs', {
        user : req.user,
        avatar : gravatar.get(req.user.local.email),
        pageName : 'lobby',
        usingBlaze : true
      });
    })
    .get('/story', function(req, res) {
      res.render('story_picker.ejs', {
      });
    })
    .get('/game', function(req, res) {
      // TODO remove this temporary   route, it's just for frontend viewing in no particular game
      res.redirect('/game/somegameidgoeshere');
    })
    .get('/game/:game_id', isLoggedIn, function(req, res) {
      res.render('game.ejs', {
        user : req.user,
        avatar : gravatar.get(req.user.local.email),
        game_id : req.params.game_id,
        pageName : 'game',
        usingBlaze : true
      });
    })
    .get('/czar', isLoggedIn, function(req, res) {
      res.render('game_czar_view.ejs', {
        user : req.user,
        avatar : gravatar.get(req.user.local.email)
      });
    })
    .get('/signup', function(req, res) {
        if (req.isAuthenticated()){
          res.redirect('/lobby');
        }else{
          res.render('signup.ejs', { message: req.flash('signupMessage') });
        }
    })
    .get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    })
    // process the login form
    .post('/', passport.authenticate('local-login', {
      successRedirect : '/lobby', // redirect to the secure profile section
      failureRedirect : '/', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }))
    .post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/lobby', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }))
    .post('/connect/:contact_id', function(req, res){
      var HTTPOptions = getHTTPOptions("/api/friends/connect/"+req.params.contact_id, 'PUT',  {'user_id': req.user._id});
      postObjects(HTTPOptions);
    });
}

//helper method for creating options for HTTP requests
//usage: URL and REST method(GET, POST, etc)
//we need to pass the user's session id so that the api can use it in some instances
function getHTTPOptions(URL, RESTMethod, optionalHeaders){

      var parsedURL = url.parse(hostname + URL);
      var options = {
        host: parsedURL.hostname,
        path: parsedURL.path,
        port: parsedURL.port,
        method: RESTMethod,
        headers: optionalHeaders
      };
      return options;
}
//used to get objects back from the database in json format
//invokes a callback after getting the list of objects
function getObjects(HTTPOptions, callback){
 var objReq =  http.request(HTTPOptions, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function(data){
        var objectList = JSON.parse(data);
        callback(objectList);
      });
      }).on('error', function(e) {console.log("Got error: " + e.message);});
      objReq.end();
}

function postObjects(HTTPOptions){
 var objReq =  http.request(HTTPOptions, function(resp) {
      }).on('error', function(e) {console.log("Got error: " + e.message);});
      objReq.end();
}


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
}


function randomId(req, res, next) {
  var alphanum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var room = '';
  for(var i = 0; i < 6; i++) {
    room += alphanum.charAt(Math.floor(Math.random() * 62));
  }
  return room;
}
