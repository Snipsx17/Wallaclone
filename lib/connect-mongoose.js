const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


mongoose.connection.on('error', err => {
    console.log('Connection error', err);
});

mongoose.connection.once('open', () => {
    console.log('Conectado a Mongo en', mongoose.connection.name);
});

mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose.connection;