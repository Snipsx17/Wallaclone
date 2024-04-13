'use strict'

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


// POST endpoint for resetting password
async function PasswordUpdate(req, res) {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'New password and confirm password do not match' });
        }

        // Get the user ID from the Token
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;


        // Find the user by ID
        const user = await User.findById( userId );
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: 'Password update successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = PasswordUpdate;
