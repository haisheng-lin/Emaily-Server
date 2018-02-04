// 这是 CommonJS import 格式，其他格式像 import React from 'react' 是 ES2015 格式，这种格式先进点
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const keys = require('./config/keys');

require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURL);

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days: how long the cookie can exit in browser
    keys: [keys.cookieKey] // array, randomly pick one to generate cookie
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

// 这个必须放在最后，因为如果前面所有路由都不匹配，才会来这里执行
if(process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like main.js and main.css file
  app.use(express.static('client/build'));

  // Express will serve up index.html file if it cannot recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Express server listening on PORT: ${PORT}`);
});