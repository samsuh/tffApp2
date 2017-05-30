var plants = require('./../controllers/plants.js');
var multer = require('multer');
var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user')



// var QRCode = require('qrcode');

module.exports = function(app){
	//root
	app.get('/',function(req,res){
		res.render('index');
	});

	app.get('/new',function(req,res){
		res.render('new');
	});

	app.post('/toPrintPage/:name',function(req,res){
		plants.toPrintPage(req,res);
	});

	app.get('/edit/:name',function(req,res){
		plants.edit(req,res);
	});


	//add plants
	app.post('/plants',function(req,res){
		plants.add(req,res);
	});

	//get all plants
	app.get('/all',function(req,res){
		plants.index(req,res);
	});

	//get all plants
	app.get('/getArchived',function(req,res){
		plants.getArchived(req,res);
	});

	//get plant by id
	app.get('/plants/:name',function(req,res){
		//console.log(req.params.id);
		plants.show(req,res);
		//plants.show(req,res);
	});

	//update plant
	app.post('/updatePlant/:name',function(req,res){
		plants.update(req,res);
	})

	//remove plant
	app.post('/removePlant/:name',function(req,res){
		// console.log(res);
		plants.remove(req,res);
	})

	//try to encode img as base64 string
	// app.post('/saveImg',function(req,res){
	// 	plants.saveImg(req,res);

	// })

	app.get('/printToFile',function(req,res){
		plants.printToFile(req,res);
	})

	app.get('/getAllPlants',function(req,res){
		plants.getAllPlants(req,res);
	})

	// app.post('/getQR/:name',function(req,res){
	// 	var name = req.params.name;
	// 	QRCode.toDataURL(name,function(err,url){
	// 		res.json(url);
	// 	});
	// })

	app.post('/archive/:name',function(req,res){
		plants.archive(req,res);
	})

	app.post('/restore/:name',function(req,res){
		plants.restore(req,res);
	})

	app.get('/showSnapshot',function(req,res){
		plants.getSnapshot(req,res);
	})

	app.get('/createSnapshot',function(req,res){
		plants.createSnapshot(req,res);
	})

	app.post('/restoreFromSnapshot/:name',function(req,res){
		plants.restoreFromSnapshot(req,res);
	})

	app.post('/removeSnapshot/:name',function(req,res){
		plants.removeSnapshot(req,res);
	})


//users page
	app.get('/users',function(req,res){
		res.render('users');
	});

	app.get('/register', function(req,res){
		res.render('register')
	});

	app.get('/login', function(req,res){
		res.render('login')
	});

	app.post('/register', function(req,res){
		//registration form submit comes here
		var name = req.body.name;
		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;
		var password2 = req.body.password2;

		//VALIDATION
		req.checkBody('name', 'Name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is invalid').isEmail();
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

		var user = require('../models/user')
		var errors = req.validationErrors();
//this doesnt work right now. cant find the key "errors"
		if(errors){
			res.render('register', {errors:errors})
		} else{
			var newUser = new User({
				name: name,
				email: email,
				username: username,
				password: password
			});

			User.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
			});
			req.flash('success_msg', "You have successfully registered!")

			res.redirect('/');
		}
	});

//gets username, finds if it exists, then validates password
	passport.use(new LocalStrategy(
	  function(username, password, done) {
	   	User.getUserByUsername(username, function(err, user){
				if(err) throw err;
				if(!user){
					return done(null, false, {message:'Unknown User'})
				}
				//if there is a User
			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else{
					return done(null, false, {message: 'Invalid password'})
				}
				})
			});
	  }));

		passport.serializeUser(function(user, done) {
		  done(null, user.id);
		});

		passport.deserializeUser(function(id, done) {
		  User.getUserById(id, function(err, user) {
		    done(err, user);
		  });
		});

	app.post('/login',
		passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login', failureFlash:true}),
		function(req,res){
			res.redirect('/');
		});

	app.get('/logout', function(req,res){
		req.logout();
		req.flash('success_msg', 'You are logged out');
		res.redirect('/login')
	});







}
