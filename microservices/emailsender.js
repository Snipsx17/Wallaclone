'use strict';

const { MailtrapClient } = require("mailtrap");
const User = require('../models/user');
const fs = require('fs');

const TOKEN = "1ca74ad981b78ec04b511ee8f1af0bf2";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Password Recovery",
};

function handlePasswordReset(req, res) {
  const email = req.body.email;
  console.log('Received password reset request from:', email);  

  User.findOne({ email })
    .then(existingUser => {
      if (!existingUser) {
        console.log('Email does not exist.');
        const errorMail = 'The email does not exist, please check again.';
        console.log(errorMail);
        res.status(400).json({ error: errorMail });
      } else {
        const recipients = email;

        fs.readFile('./views/passwordreset.html', 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading HTML template:', err);
            res.status(500).json({error: 'Internal server error'});
            return;
          }
        
        
        const htmlContent = data.replace('{{user_email}}', email).replace('{{pass_reset_link}}')

        //Send email
        client.send({
          from: sender,
          to: [{email: recipients}],
          subject: "Password Reset",
          html: htmlContent,
          category: 'Password Reset'
        })
        .then(() => {
          console.log("Email sent successfully!");
          res.status(200).json({ message: "Password recovery email sent successfully!" });
        })
        .catch(err => {
          console.error("Error sending email:", err);
          res.status(500).json({ error: "Internal server error" });
        });
        });
      }
    })
    .catch(err => {
      console.error("Error finding user:", err);
      res.status(500).json({ error: "Internal server error" });
    });
}

module.exports = handlePasswordReset;