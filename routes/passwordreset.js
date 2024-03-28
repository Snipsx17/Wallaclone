const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();
router.use(bodyParser.json());

// Store reset tokens
const resetTokens = {};

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com', // Replace with your email
        pass: 'your_password' // Replace with your password
    }
});

// Endpoint to request password reset
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).send('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    resetTokens[token] = user.id;

    const resetLink = `http://localhost:3000/passwordreset?token=${token}`;

    transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        html: `Click <a href="${resetLink}">here</a> to reset your password.`
    }, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Check your email for password reset instructions');
    });
});

// Endpoint to handle password reset
router.post('/passwordreset', (req, res) => {
    const { token, newPassword } = req.body;
    const userId = resetTokens[token];

    if (!userId) {
        return res.status(400).send('Invalid or expired token');
    }

    // Update password in your database
    // Example:
    // users[userId].password = newPassword;

    // Remove token from the resetTokens object
    delete resetTokens[token];

    res.send('Password reset successful');
});

module.exports = router;