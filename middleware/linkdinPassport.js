const passport = require("passport");
const Student = require("../models/student");
const User = require("../models/user");
const  clientid = require('../config/linkdinKey').clientId;
const clientsecret = require('../config/linkdinKey').clientSecret;
const LinkedInStrategy = require('passport-linkedin').Strategy;

passport.use(new LinkedInStrategy({
    consumerKey: clientid,
    consumerSecret: clientsecret,
    callbackURL: "http://localhost:3000/auth/linkedin/callback"
    
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {

        return done(null, profile);
      });
        
})
);


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });