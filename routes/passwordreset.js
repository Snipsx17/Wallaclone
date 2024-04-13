'use strict'

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST endpoint for resetting password
async function PasswordReset(req, res) {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        //Find the user by reset token and check if it's not expired
        const user = await User.findOne({ resetToken: token});
        if (!user || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        
        // Hash the new password
        const hashedPassword = await User.hashPassword(newPassword);
        
        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        
        await user.save();
        
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = PasswordReset;