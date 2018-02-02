const passport = require('passport');

module.exports = (app) => {
  // 这里的 'google' 不可以更改，因为 passort-google-oauth 里面，GoogleStrategy 对 passport 说
  // 如果有任何 'google' 命名的 strategy，就用我吧
  app.get('/auth/google', passport.authenticate('google', {
      scope: ['profile', 'email'], // specify what information the app want to access to user
  }));

  app.get('/auth/google/callback', passport.authenticate('google'));

  app.get('/api/logout', (req, res) => {
    req.logout(); // take the cookie and kill it by passport
    res.send(req.user);
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.session);
    // res.send(req.user);
  });
};