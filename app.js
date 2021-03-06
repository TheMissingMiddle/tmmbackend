
// set secret
require('./middleware/auth').setSecret();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var index = require('./routes/index');
var users = require('./routes/users');
var contacts = require('./routes/contacts');
var userData = require('./routes/user-data');
var tmmPass = require('./middleware/tmm-passport')
var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*'); // GET,PUT,POST,DELETE
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};
var jwtTokenHandler = function (req, res, next) {
    console.log('token handler called. now authenticating...');
    tmmPass.authenticate('jwt', {session:false}, function (err, data, info) {
        console.log(err);
        console.log(data);
        console.log(info);
        if(err || info) {
            res.json({
                Status: 'Error',
                Error: (err===undefined||err===null||err==='') ? info : err
            });
        } else if (data.id === undefined || data.id === '' || data.email === undefined || data.email === '') {
            res.json({
                Status: 'Error',
                Error: 'Invalid JWT Information'
            });
        } else {
            req.decodedJWTData = data;
            next();
        }
    })(req, res, next);
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Misc
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes configuration

// Public Routes
app.use('*', allowCrossDomain);
app.use('/', index);
app.use('/users', users);

// Protected Routes
app.all('*', jwtTokenHandler);
app.use('/contacts', contacts);
app.use('/user-data', userData);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
