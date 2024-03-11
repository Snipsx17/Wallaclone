const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// mongoose.connection.on('connected', () => {
//     console.log('Connected to MongoDB');
// });

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

userSchema.statics.hashPassword = async function(passwordenclaro){
    try {
        return await bcrypt.hash(passwordenclaro, 7);
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

userSchema.methods.comparePassword = async function(passwordenclaro) {
    try {
        return await bcrypt.compare(passwordenclaro, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;