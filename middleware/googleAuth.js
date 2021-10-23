const passport = require("passport");
const User = require("../models/user");
const Student = require("../models/student");
const clientId = require('../config/googleKey').clientId;
const clientSecret = require('../config/googleKey').clientSecret;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

//passport google authentication
    passport.use(new GoogleStrategy({
        clientID : clientId,
        clientSecret : clientSecret,
        callbackURL : 'http://localhost:3000/google/callback',
 },(accessToken, refreshToken, profile, done) => {
    console.log(profile.emails[0].value);

    // find if a user exist with this email or not
    User.findOne({ email: profile.emails[0].value }).then((data) => {
        if (data) {
            // user exitst
            // update data
            // I am skipping that part here, may Update Later
            return done(null, data);
        } else {
            // create a user
            user({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                password: null,
                provider: 'google',
                isVerified: true,
            }).save(function (err, data) {
                return done(null, data);
            });
        }
    });
}
));

passport.serializeUser(function (user, cb) {
    cb(null, user.id)
});

passport.deserializeUser(function (id, cb) {
    Student.findById(id, function (err, user) {
        cb(err, user)
    });
});
