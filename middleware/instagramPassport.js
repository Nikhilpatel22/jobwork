const passport = require("passport");
const iuser = require("../models/iuser");
const clientId = require('../config/instagramKey').clientId;
const clientSecret = require('../config/instagramKey').clientSecret;
const InstagramStrategy = require('passport-instagram').Strategy;

passport.use(new InstagramStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "https://localhost:3000/auth/instagram/callback",
    scope : ['user_profile']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
  }
  // {
  //   iuser.findOne({ 'instagram.id': profile.id }, function(err, user) {
  //     if (err) return callback(err);
  
  //     if (user) {
  //       return callback(null, user); // Check if user already exists
  //     }
  
  //     const {
  //       id,
  //       full_name,
  //       username,
  //       profile_picture,
  //       bio,
  //       website,
  //       counts: { media, follows, followed_by }
  //     } = profile._json.data;
  
  //     const new_user = new User({
  //       instagram: {
  //         id,
  //         accessToken,
  //         full_name,
  //         username,
  //         profile_picture,
  //         bio,
  //         website,
  //         counts: {
  //           media,
  //           follows,
  //           followed_by
  //         }
  //       }
  //     });
  
  //     new_user.save(function(err, user) {
  //       if (err) {
  //         throw err;
  //       }
  //       return callback(null, user);
  //     });
  //   });
    
   
  // }
));

passport.serializeUser(function (user, cb) {
    cb(null, user.id)
});

passport.deserializeUser(function (id, cb) {
    iuser.findById(id, function (err, user) {
        cb(err, user)
    });
});
