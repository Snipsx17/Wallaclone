const mongoose = require('mongoose');
const user = require('../models/user');

mongoose.connection.on('error', err => {
    console.log('Connection error', err);
});

mongoose.connection.once('open', () => {
    console.log('Conectado a Mongo en', mongoose.connection.name);
});

console.log('Attempting to connect to MongoDB...');

const connectionPromise = mongoose.connect('mongodb://127.0.0.1/Wallaclone', {

});

module.exports = connectionPromise;