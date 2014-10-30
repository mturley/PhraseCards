// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the player model
var Player            = require('../app/models/player');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize players out of session

    // used to serialize the player for the session
    passport.serializeUser(function(player, done) {
        done(null, player.id);
    });

    // used to deserialize the player
    passport.deserializeUser(function(id, done) {
        Player.findById(id, function(err, player) {
            done(err, player);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // Player.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a player whose email is the same as the forms email
        // we are checking to see if the player trying to login already exists
        Player.findOne({ 'local.email' :  email }, function(err, player) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a player with that email
            if (player) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no player with that email
                // create the player
                var newPlayer            = new Player();

                // set the player's local credentials
                newPlayer.local.email    = email;
                newPlayer.local.password = newPlayer.generateHash(password);

                // save the player
                newPlayer.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newPlayer);
                });
            }

        });    

        });

    }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a player whose email is the same as the forms email
        // we are checking to see if the player trying to login already exists
        Player.findOne({ 'local.email' :  email }, function(err, player) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            // if no player is found, return the message
            if (!player){
                return done(null, false, req.flash('loginMessage', 'No player found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the player is found but the password is wrong
            if (!player.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful player
            return done(null, player);
        });

    }));
}

