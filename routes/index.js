var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/register', (req, res) => {
  res.render('register');
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
