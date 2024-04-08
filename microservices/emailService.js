'use strict';

const { MailtrapClient } = require("mailtrap");
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const ENDPOINT = process.env.ENDPOINT;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

async function sendEmail(emailData) {
    try {
        await client.send({
            from: emailData.sender,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html_body
        });
        console.log("Email sent successfully");
    } catch(error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
}

module.exports = {
    sendEmail: sendEmail,
    emailData: {} 
};
