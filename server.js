var express = require('express');
var app = express();

// Used for flash messages on create plant page
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
require('./config/passport')(passport);


//login app dependencies
var favicon = require('serve-favicon');
var logger = require('morgan');

app.use(cookieParser('secretString'));
app.use(bodyParser.json());
app.use(session({
		cookie: { maxAge: 60000 },
		secret: "cookie_secret",
    // name: cookie_name,
    proxy: true,
    resave: true,
    saveUninitialized: true}));
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());

var path = require('path');
var fs = require("fs");
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}));
app.use(express.static(__dirname+"/public"));
app.set('views',path.join(__dirname,'./views'));
app.set('view engine','ejs');


var expressValidator = require('express-validator');
app.use(expressValidator());
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require ('passport-local'), Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://admin:admin123@localhost:27017/admin');
// var db = mongoose.connection;
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var fs = require("fs");


// require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);
var routes = require('./routes/index');



// var io = require('socket.io').listen(server);
//
//
// // to be cut
// io.on('connection', function(socket){
//  fs.readFile(__dirname + '/public/uploads/image.png', function(err, buf){
//
//    socket.emit('image', { image: true, buffer: buf.toString('base64') });
//    console.log('image file is initialized');
//  });
// });


// var users = require('./routes/users')


//Session
// app.use(session({
// 	secret: 'campsecret',
// 	saveUninitialized: true,
// 	resave: true
// }));



app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


//View Engine
app.use(express.static(__dirname+"/public"));
app.set('views',path.join(__dirname,'./views'));
app.set('view engine','ejs');

//start server
var server = app.listen(8001,function(){
	console.log('listening on port 8001...');
})
