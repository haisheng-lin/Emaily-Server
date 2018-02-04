const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
  // 为什么这里不是 requireLogin()？因为加上括号的意思就是马上执行
  // 否则，像以下这样写，就是说当收到'/api/stripe'的请求时，才执行该函数
  app.post('/api/stripe', requireLogin, async (req, res) => {

    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    });
    
    // req.user is User Model
    req.user.credits += 5;
    const user = await req.user.save();
    res.json(user);
  });
};