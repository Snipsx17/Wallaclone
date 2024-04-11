const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const createError = require("http-errors");
const Advert = require("../models/advert");

class UserController {
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

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Check if the user exists in the database
      const user = await User.findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {
        //console.log('User successfully logged in.');

        const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: process.env.EXPIRATION_TOKEN }
        );

        res.json({ token });
      } else {
        //console.log('Invalid username or password.');
        const errorMessage = "Invalid username or password.";
        // Respond with an error JSON message
        res.status(401).json({ success: false, error: errorMessage });
      }
    } catch (error) {
      //console.error('Error during login:', error);
      const errorMessage = "An error occurred during login. Please try again.";
      // Render an error message as a JSON
      res.status(500).json({ success: false, message: errorMessage });
    }
  }

  async getUser(req, res, next) {
    const authHeader = req.get("Authorization");
    const id = req.params.userId;

    try {
      if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET, async (err, id) => {
          if (err) {
            next(createError(404, "Not valid token"));
            return;
          }

          const user = await User.find(
            { _id: id.userId },
            "username email"
          ).exec();

          res.json(user);
          return;
        });
      }

      if (id) {
        const response = await User.find({ _id: id }, "username email").exec();

        if (!response || response.length === 0) {
          next(createError(404, "User not found"));
          return;
        }

        res.json(response);
      }
    } catch (error) {
      next(createError(404, "User not found"));
    }
  }

  async addFavorite(req, res, next) {
    const userId = req.userId.userId;
    const { advertId } = req.params;
    let advert = {}
    
    try {
      advert = await Advert.findById(advertId);
    } catch (error) {
      next(createError(404, 'Advert not found'));
      return
    }

    const user = await User.findById({ _id: userId });
    let { favorites: userFavorites } = user;
    !userFavorites.includes(advert._id)
      ? userFavorites.push(advert._id)
      : userFavorites.pop(advert._id);

    try {
      await User.findOneAndUpdate({_id: user._id}, {favorites: userFavorites}, {new: true})
      res.sendStatus(200)
      
    } catch (error) {
      next(createError(500, 'Error trying to add favorite'))
    }
    
  }
}

module.exports = UserController;
