'use strict';

var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const connectDatabase = require('./lib/connect-mongoose');
const errorhandler = require('errorhandler');
require('dotenv').config()
const validateToken = require('./middleware/validatetoken');

const passportconfig = require('./config/passport-config');
const User = require('./models/user');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');

passportconfig();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/register', registerRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;