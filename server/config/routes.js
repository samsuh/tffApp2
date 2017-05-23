var plants = require('./../controllers/plants.js');
var multer = require('multer');
var fs = require('fs');

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

		var errors = req.validationErrors();

		if(errors){
			res.render('register', {errors:errors})
		} else{
			console.log("Validations are OK");
		}
	});

	app.post('/login', function(req,res){
		//login form submit comes here
	});






}
