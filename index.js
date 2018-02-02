// 这是 CommonJS import 格式，其他格式像 import React from 'react' 是 ES2015 格式，这种格式先进点
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys');

require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURL);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days: how long the cookie can exit in browser
    keys: [keys.cookieKey] // array, randomly pick one to generate cookie
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Express server listening on PORT: ${PORT}`);
});