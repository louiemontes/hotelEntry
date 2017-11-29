var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var form = require('./routes/form');
var formerrors = require('./routes/formerrors');

var validator = require('express-validator');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

// have to use every router? really unsure why
app.use('/', index);
app.use('/users', users);
app.use('/form', form);
app.use('/formerrors', formerrors);

app.post('/process_post', urlencodedParser, function(req,res){
  req.checkBody("first_name", "Input a name.").notEmpty();
  req.checkBody("first_name", "Invalid name.").isAlpha();
  req.checkBody("age", "Input an age").notEmpty();
  req.checkBody("age", "Invalid age.").isInt();

  var errors = req.validationErrors();
  console.log(errors);
  if (errors) {
    let hasNameError = false;
    let hasAgeError = false;
    let errorsString = "";
    for (let i = 0; i< errors.length; i++) {
      if(errors[i].param === "first_name" && !hasNameError) {
        hasNameError = true;
        errorsString += errors[i].msg + "\n";
      } else if(errors[i].param === "age" && !hasAgeError){
        hasAgeError = true;
        errorsString += errors[i].msg + "\n";
      }
    }
     res.render('formerrors', {allErrors: errorsString});
     return;
   } else {
     res.render('formerrors', {allErrors: "No problems detected."});
     return;
   }
});

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

app.post('./register', urlencodedParser, function (req, res) {
   req.checkBody("name", "Bruv have some respect, capitlize your name.").isAlpha(); // hang on
   var errors = req.validationErrors();
   if (errors) {
    let stringedErrors = (errors[0].msg);
    // document.getElementById("errors").innerHTML = stringedErrors;
    // res.send(stringedErrors);
     res.render('formerrors', errors);
     return;
   } else {
     res.send("all good m8");
     return;
   }
});

module.exports = app;
