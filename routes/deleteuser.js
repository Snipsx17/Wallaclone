'use strict'

require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require("mongoose");

router.post('/api/deleteuser', async (req, res) => {
    try {
        //Get user ID through username
        const {userId} = req.body;
        const user = await  User.findById(userId);
        if(!user) {
            return res.status(404).json({error: 'User not found'});
        } 
        await User.findByIdAndDelete(userId);
        res.json({message: 'User deleted successfully'});
        }
    catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({error: 'Internal server error'});
    }

});


module.exports = router;