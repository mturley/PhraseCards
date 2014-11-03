// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '312265405632307', // your App ID
        'clientSecret'  : 'f07fac09314445c1935803cab3f029b4', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    }
};
