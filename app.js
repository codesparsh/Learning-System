var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http'); 
var logger = require('morgan');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv').config();
var FileStore = require('session-file-store')(session);
const passportLocalMongoose = require('passport-local-mongoose');
var authenticate = require('./authenticate');
const Settings = require('./models/settings');
var expressLayouts = require('express-ejs-layouts');

const url = 'mongodb://localhost:27017/udema';

const connect = mongoose.connect(url,{ useNewUrlParser: true });
connect.then((db)=>{
  console.log('connected correctly to serve to udema');
},(err)=>{console.log(err)});

var app = express();

// view engine setup

// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use(logger('dev'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser('12345-67890-09876-54378'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54378',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use(function(req,res,next){
  Settings.findOne({name:'lightworkerlocator'})
  .then((settings)=>{
    res.locals.settings = settings;
  })
  next();
})



app.use(function(req,res,next){
  if(req.session.loggedin){

    res.locals.isAuth = true;
    res.locals.user = req.user;
    res.locals.userId = req.session.userId;
    next();
  }else{
    res.locals.isAuth = false,
    next();
  }

})




const indexRoute = require('./routes/index');
const registerRoute = require('./controllers/register')
const adminRoute = require('./routes/admin');


app.use('/register',registerRoute);  
app.use('/',indexRoute);
app.use('/admin',adminRoute);


function auth (req, res, next) {
console.log(req.user);

if (!req.user) {
  var err = new Error('You are not authenticated!');
  err.status = 403;
  next(err);
}
else {
      next();
}
}

app.use(auth);


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
