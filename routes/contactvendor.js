"use strict";

require("dotenv").config();
const express = require('express');
const router = express.Router();
const Advert = require('../models/advert');
const emailService = require('../microservices/emailService');
const jwt = require('jsonwebtoken')
const User = require('../models/user');

// Endpoint for sending emails from buyer to ad owner
router.post('/api/contactvendor', async (req, res) => {
    try {
        // Extract data from the request body
        const {advertId} = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const buyername = decodedToken.username;

        const user = await User.findOne({ username: buyername });

        const buyerEmail = user.email;

        const responder = buyerEmail;

        // Find the advert by ID
        const advert = await Advert.findById(advertId);

        if (!advert) {
            return res.status(404).json({ error: 'Advert not found' });
        }

        // Get owner's email from advert model
        const ownerEmail = await advert.getOwnerEmail();

        if (!ownerEmail) {
            return res.status(500).json({ error: 'Failed to get owner email' });
        }

        //Predefined message

        const advertLink = `http://127.0.0.1:3000/api/advert/id/${advertId}`;
        const advertName = advert.name;


        const message = `<p>Hello, I'm interested in your advertisement <a href="${advertLink}">${advertName}</a>. Please provide more details.</p>`;


        // Email data
        const emailData = {
            sender: { email: 'admin@coderstrikeback.es' },
            to: [{ email: ownerEmail }],
            subject: 'Message from buyer regarding your advert',
            text: message,
            html_body: `<p>${message}</p><p>You can reply directly to this email or contact the buyer through: <a href="mailto:${buyerEmail}">${buyerEmail}</a></p>`,
        };

        // Send email
        await emailService.sendEmail(emailData, buyerEmail);

        // Respond with success message
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;