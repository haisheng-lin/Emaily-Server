const mongoose = require('mongoose');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = require('../models/Survey');

module.exports = async (app) => {
  app.post('/api/surveys', requireLogin, requireCredits,  (req, res) => {
    const { title, subject, body, recipients } = req.body;
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
    mailer.send();
  });
};