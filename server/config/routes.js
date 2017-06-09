var plants = require('./../controllers/plants.js');
var multer = require('multer');
var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var User = require('../models/user')

// var QRCode = require('qrcode');

module.exports = function(app){
	// unprotected routes
	app.get('/',function(req,res){
		console.log(req.isAuthenticated());
		res.render('index');
	});

	app.get('/login', function(req,res){
		res.render('login', {message: req.flash("message")})
	});

	app.post('/login',
		passport.authenticate('local-login', {successRedirect:'/', failureRedirect:'/login', failureFlash:true}),
		function(req,res){
			console.log('login hits properly' + username)
			res.redirect('/');
		});

	// protected routes


	function validateUser(req, res, next){
		if (req.isAuthenticated())
	      return next();
	  res.redirect('/');
	}

	// Defining New Router
	var userRouter = express.Router();
	// Setting Base Path of New Router
	app.use("/users", userRouter);
	//
	// Adding Validate User Middle Ware
	// All routes defined after this line will run validateUser
	// before processing request
	userRouter.get('/safe', function(req, res){
		res.send("THIS IS A PUBLIC ROUTE")
	})

	userRouter.use(validateUser);

	// Route
	userRouter.get('/new', function(req, res){
		res.render('new');
	})

	userRouter.get('/all', function(req, res){
		res.render('all');
	})

	userRouter.get('/getArchived', function(req, res){
		res.render('getArchived');
	})

	userRouter.get('/showSnapshot', function(req, res){
		res.render('showSnapshot');
	})
	// userRouter.get('/signup', function(req, res){
	// 	res.render('signup');
	// })


// // you can do it this way also, quicker and dirtier, but this is bad code.
// 	app.use(validateUser);
	// app.get('/new',function(req,res){
	// 	res.render('new');
	// });

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

		//Auth Example
		// app.use("/auth", authRouter);


//users page



	app.get('/users',function(req,res){
		res.render('users');
	});

	app.get('/signup', function(req,res){
		res.render('signup', {message: req.flash("message")})
	});


	app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

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

	app.get('/logout', function(req,res){
		req.logout();
		req.flash('success_msg', 'You are logged out');
		res.redirect('/')
	});







}
