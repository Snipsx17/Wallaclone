// routes/register.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.use(express.urlencoded({ extended: true }));

// GET register page
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

// POST register form
router.post('/', async function(req, res, next) {
  try {
    const { username, password } = req.body;
    console.log('Received registration request for username:', username);

    console.log('req.body:', req.body);

    // Check if the user already exists in the database using the username
    const existingUser = await User.findOne({ username });
    console.log(existingUser, 'es un usuario existente');
    

    if (!existingUser) {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      


      // Create a new user
      const newUser = new User({
        username,
        password: hashedPassword
      });

      // Save the new user to the database
      await newUser.save();

      console.log('User successfully registered.');
      res.redirect('/login');
    } else {
      console.log('Username already exists. Not creating a new user.');
      const errorMessage = 'The username already exists. Please choose a different username';
      return res.render('register', { title: 'Register', error: errorMessage });
    }
  } catch (error) {
    // Handle any errors that occur during the registration process
    console.error('Error during registration:', error);
    next(error);
  }
});


module.exports = router;