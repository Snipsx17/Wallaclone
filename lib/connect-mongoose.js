const mongoose = require('mongoose');
const user = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();


mongoose.connection.on('error', err => {
    console.log('Connection error', err);
});

mongoose.connection.once('open', () => {
    console.log('Conectado a Mongo en', mongoose.connection.name);
});

console.log('Attempting to connect to MongoDB...');

const connectionPromise = mongoose.connect(process.env.MONGODB_URI, {

});

module.exports = connectionPromise;