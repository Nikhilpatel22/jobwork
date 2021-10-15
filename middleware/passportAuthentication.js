const passport = require("passport");
const Student = require("../models/student");
const bcrypt = require('bcrypt');

//passport authentication
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    Student.findOne({ email: email }, (err, data) => {
        if (err) throw err;
        if (!data) {
            return done(null, false, { message: "user does't exist.." });
        }
        bcrypt.compare(password, data.password, (err, match) => {
            if (err) {
                return done(null, false)
            }
            if (!match) {
                return done(null, false, { message: "password wrong.." })
            }
            if (match) {
                return done(null, data)
            }
        });
    });
}));

passport.serializeUser(function (user, cb) {
    cb(null, user.id)
});

passport.deserializeUser(function (id, cb) {
    Student.findById(id, function (err, user) {
        cb(err, user)
    });
});
