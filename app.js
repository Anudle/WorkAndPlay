'use strict'
require('dotenv').config()

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Passport's sessions requires express-session to work
const session = require('express-session');
const passport = require('./passport'); // Require passport file


const index = require('./controllers/index');
const users = require('./controllers/users');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure express session
app.use(session({
  secret:  process.env.SESSION_KEY,
  saveUninitialized: true,
  resave: false
}));

app.use(passport.initialize());// Mount Passport mdilldeware onto Express
app.use(passport.session()); //Mount Passport session middleware onto Express


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index); // read posts and make comments
app.use('/users', users); // login create delete users

// app.use('/posts', posts);//create new posts, edit posts, get post by id, delete posts.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
