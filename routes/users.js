// routes/users.js

var express = require('express');
var router = express.Router();
var passport = require('passport');

// Route for authenticated users
router.get('/', isLoggedIn, function (req, res, next) {
  res.send('respond with a resource for authenticated users');
});

// Route for all users
router.get('/all', function(req, res, next) {
  res.send('respond with a resource for all users');
});

// Middleware to check if a user is authenticated
function isLoggedIn(req, res, next) {
  // Passport adds the isAuthenticated() method to the request object
  if (req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, redirect to login or handle as needed
  res.redirect('/login');
}

module.exports = router;
