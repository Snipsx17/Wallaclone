"use strict";

require("dotenv").config();

var createError = require("http-errors");
const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const app = express();

// CONFIG
const passportconfig = require("./config/passport-config");
const fileUpload = require("express-fileupload");
passportconfig();

// MIDDELWARE
const validateToken = require("./middleware/validatetoken");

// CONTROLLERS
const AdvertController = require("./controllers/AdvertController");
const RegisterController = require("./controllers/RegisterController");
const LoginController = require("./controllers/LoginController");
const TagsController = require("./controllers/TagsController");

// DB CONNECTION
require("./lib/connect-mongoose");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with frontend's domain
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Add any additional headers needed
  res.status(200).send();
});

//=========== CONTROLLERS INSTANCES =============
const advertController = new AdvertController();
const tagsController = new TagsController();
const registerController = new RegisterController();
const loginController = new LoginController();

//=========== ROUTER =============
// REGISTER
app.post("/api/register", registerController.create);
// LOGIN
app.post("/api/login", loginController.login);
// ADVERTS
app.get("/api/adverts", advertController.get);
app.get("/api/advert/id/:id", advertController.getById);
app.post("/api/advert/new", validateToken, advertController.post);
app.delete("/api/advert/:id", validateToken, advertController.delete);
app.put("/api/advert/:id", validateToken, advertController.put);
// TAGS
app.get("/api/tags", validateToken, tagsController.get);

//=========== CATCH 404 =============
app.use(function (req, res, next) {
  next(createError(404));
});

//=========== ERROR HANDLER =============
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
