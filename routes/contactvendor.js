// Inside your router/controller file
const express = require('express');
const router = express.Router();
const Advert = require('../models/advert');
const emailService = require('../microservices/emailService');

// Endpoint for sending emails from buyer to ad owner
router.post('/api/contactvendor', async (req, res) => {
    try {
        // Extract data from the request body
        const { advertId, buyerEmail} = req.body;

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
        console.log(buyerEmail);

        //Predefined message
        const message = `Hello,I'm interested in your advertisement. Please provide more details.`;

        // Email data
        const emailData = {
            sender: { email: 'admin@coderstrikeback.es' },
            to: [{ email: ownerEmail }],
            subject: 'Message from buyer regarding your advert',
            text: message,
            html_body: `<p>${message}</p><p>Reply to the interested buyer: <a href="mailto:${buyerEmail}">${buyerEmail}</a></p>`
        };

        // Send email
        await emailService.sendEmail(emailData);

        // Respond with success message
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
