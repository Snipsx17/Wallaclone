const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

class LoginController{
    async login(req, res, next) {
        try {
          const { username, password } = req.body;
      
          // Check if the user exists in the database
          const user = await User.findOne({ username });
      
          if (user && await bcrypt.compare(password, user.password)) {
            //console.log('User successfully logged in.');
      
            const token = jwt.sign({ userId: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRATION_TOKEN});
            
            res.json({token});
            
          } else {
            //console.log('Invalid username or password.');
            const errorMessage = 'Invalid username or password.';
            // Respond with an error JSON message
            res.status(401).json({ success: false, error: errorMessage})
          }
        } catch (error) {
          //console.error('Error during login:', error);
          const errorMessage = 'An error occurred during login. Please try again.';
          // Render an error message as a JSON
          res.status(500).json({ success: false, message: errorMessage});
        }
      }
}

module.exports = LoginController;