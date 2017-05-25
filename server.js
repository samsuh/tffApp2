var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Used for flash messages on create plant page
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

app.use(bodyParser.json());
app.use(cookieParser('secretString'));
app.use(session({
		cookie: { maxAge: 60000 },
		secret: "cookie_secret",
    // name: cookie_name,
    proxy: true,
    resave: true,
    saveUninitialized: true}));
app.use(flash());

var path = require('path');
var fs = require("fs");
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}));
app.use(express.static(__dirname+"/public"));
app.set('views',path.join(__dirname,'./views'));
app.set('view engine','ejs');

// require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

var server = app.listen(8001,function(){
	console.log('listening on port 8001...');
})

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
