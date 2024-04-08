'use strict';

const { MailtrapClient } = require("mailtrap");
const User = require('../models/user');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const emailService = require('./emailService');

const client = new MailtrapClient({ endpoint: process.env.ENDPOINT, token: process.env.TOKEN });

function generateToken(email) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

function PasswordResetRequest(req, res) {
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
                const token = generateToken(email);

                existingUser.resetToken = token;
                existingUser.resetTokenExpires = Date.now() + 3600000;

                existingUser.save()
                    .then(() => {
                        const resetLink = `http://127.0.0.1:3000/api/passwordreset/${token}`;
                        const recipients = email;

                        fs.readFile('./views/passwordresetmail.html', 'utf8', (err, data) => {
                            if (err) {
                                console.error('Error reading HTML template:', err);
                                res.status(500).json({ error: 'Cannot read HTML template' });
                                return;
                            }

                            const htmlContent = data.replace('{{user_email}}', email).replace('{{pass_reset_link}}', resetLink);

                            // Construct email data object
                            const emailData = {
                                sender: { email: "admin@coderstrikeback.es" },
                                subject: "Password Reset",
                                to: [{email: recipients}],
                                html_body: htmlContent
                            };

                            // Send email using emailService module
                            emailService.sendEmail(emailData)
                                .then(() => {
                                    res.status(200).json({ message: "Password recovery email sent successfully!" });
                                })
                                .catch(err => {
                                    console.error("Error sending email:", err);
                                    res.status(500).json({ error: "Error sending email" });
                                });
                        });
                    })
                    .catch(err => {
                        console.error("Error saving user:", err);
                        res.status(500).json({ error: "Error saving user" });
                    });
            }
        })
        .catch(err => {
            console.error("Error finding user:", err);
            res.status(500).json({ error: "Error finding user" });
        });
}

module.exports = PasswordResetRequest;