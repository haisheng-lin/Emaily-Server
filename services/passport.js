const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id); // id is the shortcut of _id
});

passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => {
    done(null, user);
  });
});

/** 
 * profile fields:
 * id, displayName, name {familyName, givenName}, emails[value, type,], photos[value], provider
 * id is the unique user identifier
 */
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    // new User({ googleId: profile.id }).save();
    User.findOne({ googleId: profile.id })
    .then((user) => {
      if(user) { // we already have a record with the given profile ID
        done(null, user);
      } else { // we don't have a user record with this profile ID, make a new record
        new User({ googleId: profile.id }).save()
        .then((user) => {
          done(null, user);
        });
      }
    });
  })
);