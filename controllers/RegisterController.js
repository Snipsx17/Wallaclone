const bcrypt = require("bcrypt");
const User = require("../models/user");

class RegisterController {
  async create(req, res, next) {
    //Recieve the user registration petition
    try {
      const { username, email, password, confirmPassword } = req.body;
      //Check if passwords match
      if (password !== confirmPassword) {
        const errorPassword =
          "Passwords do not match. Please enter a matching password.";
        //console.log(errorPassword);
        return res.status(400).json({ error: errorPassword });
      }

      const existingUser = await User.findOne({ username });
      const existingmail = await User.findOne({ email });

      if (!existingUser && !existingmail) {
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        //console.log('User successfully registered.');
        res.json({ message: "User successfully registered" });

        // Check if the user already exists in the database using the username
      } else if (existingUser) {
        //console.log('Username already exists. Not creating a new user.');
        const errorUser =
          "The username already exists. Please choose a different username";
        //console.log(errorUser);
        res.status(400).json({ error: errorUser });
        // Check if the email already exists in the database using the email
      } else if (existingmail) {
        //console.log('Email already exists. Not creating a new user.');
        const errorMail =
          "The email already exists. Please choose a different email";
        //console.log(errorMail);
        res.status(400).json({ error: errorMail });
      }
    } catch (error) {
      // Handle any errors that occur during the registration process
      //console.error('Error during registration:', error);
      next(error);
    }
  }
}

module.exports = RegisterController;
