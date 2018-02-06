const _ = require('lodash');
const pathParser = require('path-parser');
const { URL } = require('url'); // default module in NodeJS
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = require('../models/Survey');

module.exports = async (app) => {

  app.get('/api/surveys', requireLogin, async (req, res) => {
    // exclude 'recipients' field
    const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: false });
    res.json(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {

    const p = new pathParser('/api/surveys/:surveyId/:choice');

    // 使用 lodash chain function 重构代码
    _.chain(req.body)

    // 1. 清理路由不匹配的数据
    .map(({ email, url }) => {
      // { surveyId: 'blablabla', choice: 'blablabla' }, or null 如果没有同时匹配 surveyId 和 choice
      const match = p.test(new URL(url).pathname);
      if(match) {
        return { email, surveyId: match.surveyId, choice: match.choice };
      }
    })

    // 2. 清理重复的数据
    .compact()
    .uniqBy('email', 'suveyId')

    // 3. 对每个 event，更新数据库
    .each(({ surveyId, choice, email }) => {
      Survey.updateOne({
        _id: surveyId,
        recipients: {
          $elemMatch: { email: email, responded: false }
        }
      }, {
        $inc: { [choice]: 1 },
        $set: { 'recipients.$.responded': true },
        lastResponded: new Date()
      }).exec();
    })
    
    // 4. 返回结果
    .value();

    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    // 在创建一个新的对象时，survey 就已经包含 _id 这个属性了
    const survey = new Survey({
      title: title,
      subject: subject,
      body: body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // great place to send email
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      // only save the survey after the email successfully sent
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch(err) {
      res.status(422).send(err);
    }
  });
};