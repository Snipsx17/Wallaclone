'use strict';

require('dotenv').config()
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
const AdvertController = require('./controllers/AdvertController');
const passportconfig = require('./config/passport-config');
const User = require('./models/user');
const fileUpload = require("express-fileupload");

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
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/register', registerRouter);
app.use('/login', loginRouter);

//instances 
const advertController = new AdvertController();

app.get('/api/adverts', advertController.get);
app.get('/api/id/:id', advertController.getById);
app.post('/api/advert/new', advertController.post);
app.delete('/api/advert/:id', advertController.delete);
app.put('/api/advert/:id', advertController.put);

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