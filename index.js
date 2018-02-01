// 这是 CommonJS import 格式，其他格式像 import React from 'react' 是 ES2015 格式，这种格式先进点
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();

/** 
 * profile fields:
 * id, displayName, name {familyName, givenName}, emails[value, type,], photos[value], provider
 *
 */

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        
    })
);

// 这里的 'google' 不可以更改，因为 passort-google-oauth 里面，GoogleStrategy 对 passport 说
// 如果有任何 'google' 命名的 strategy，就用我吧
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'], // specify what information the app want to access to user
}));

app.get('/auth/google/callback', passport.authenticate('google'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Express server listening on PORT: ${PORT}`);
});