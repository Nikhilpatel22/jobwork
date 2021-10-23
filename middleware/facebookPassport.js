const passport = require("passport");
const Student = require("../models/student");
const fuser = require("../models/fuser");
const clientappId = require('../config/facebookKey').clientId;
const clientappSecret = require('../config/facebookKey').clientSecret;
const facebookStrategy = require('passport-facebook').Strategy;

passport.use(new facebookStrategy({
    clientID: clientappId,
    clientSecret: clientappSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields   : ['id','displayName','name','gender','picture.type(large)','email']
},
  function(accessToken, refreshToken, profile, done) 
  {

    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
        fuser.findOne({ 'uid' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newUser            = new fuser();

                // set all of the facebook information in our user model
                newUser.uid    = profile.id; // set the users facebook id                   
                       
                newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                newUser.gender = profile.gender
                newUser.pic = profile.photos[0].value
                // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newUser);
                });
            }

        });

    } )
  }
))
passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(function (id, done) {
      return  done(null, user);
    
});
