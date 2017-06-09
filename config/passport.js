var LocalStrategy = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../server/models/user');
var configAuth = require('./auth');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email':  email }, function(err, user) {

        if (err){
          console.log('some kind of error')
          return done(err, false, {message: 'Process failure'});
        };
        if (user) {
          return done(null, false, req.flash('message', 'That email is already taken.'));
        } else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err){
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email':  email }, function(err, user) {
      console.log("Hitting Local-Login Strategy", err, user)
      if (err){
      console.log('some kind of error')
          return done(err, false, {message: 'Process failure'});
      }
      if (!user){
      console.log('got to if not user')
          return done(null, false, req.flash('message', 'Invalid Credentials.'));
      }
      if (!user.validPassword(password)){
      console.log('got to if not valid password')
          return done(null, false, req.flash('message', 'Invalid Credentials'));
      }
      console.log('all good');

      //put this in session

      return done(null, user);
    });
  }));

};
