const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id); // id is the shortcut of _id
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

/** 
 * profile fields:
 * id, displayName, name {familyName, givenName}, emails[value, type,], photos[value], provider
 * id is the unique user identifier
 */
// 使用 async, await 语法糖使得代码更简洁
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {

    const existingUser = await User.findOne({ googleId: profile.id });
    if(existingUser) { // we already have a record with the given profile ID
      return done(null, existingUser);
    }

    // we don't have a user record with this profile ID, make a new record
    const user = await new User({ googleId: profile.id }).save();
    done(null, user);
  })
);