var FranchiseModel = require('../models/franchise').FranchiseModel;
var FranchisorModel = require('../models/franchisor').FranchisorModel;
var mongoose = require('mongoose');
var CheckAuth = require('../middleware/checkAuth');
var Encrypter = require('../helpers/encryption');
module.exports = function(app){


	app.get('/franchises/initialize', function(req, res){
		FranchiseModel.remove(function(err){
			if (err) throw err;

			FranchisorModel.findOne({"cctdl":"ar"}).exec(function(err,franchisor){
				console.log(franchisor.length)

				FranchisorModel.find().exec(function(err,franchisor){
					console.log(franchisor.length)
				})
				FranchiseModel.remove({});
				var franchise = new FranchiseModel();
				franchise.name = 'Parana'
				franchise.slug = "parana"
				franchise.franchisor = franchisor._id
				franchise.save(function(err){
					if(!err){
						console.log(franchise);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var franchise = new FranchiseModel();
				franchise.name = 'Rosario'
				franchise.slug = "rosario"
				franchise.franchisor = franchisor._id
				franchise.is_default = true
				franchise.save(function(err){
					if(!err){
						console.log(franchise);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var franchise = new FranchiseModel();
				franchise.name = 'Buenos Aires'
				franchise.slug = "buenosaires"
				franchise.franchisor = franchisor._id
				franchise.save(function(err){
					if(!err){
						console.log(franchise);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var franchise = new FranchiseModel();
				franchise.name = 'Santa Fe'
				franchise.slug = "santafe"
				franchise.franchisor = franchisor._id
				franchise.save(function(err){
					if(!err){
						console.log(franchise);
					} else {
						console.log("Error: - " + err);
					}
				}); 

			})
		});

			
	});

	app.get('/franchises/change_franchise/:slug',function (req, res,  next){
		FranchiseModel.findOne({"slug": req.params.slug}).exec(function(err, franchise){
			req.session.user = req.session.user || new Object();
			req.session.expose.selected_franchise = franchise;
			res.redirect('/');
		});
	});


	app.get('/franchises/create', CheckAuth.user, function(req, res){
		FranchisorModel.find({}, function(err, franchisors){
			res.render('franchises/create', {
				title 		: 'Cargar franquicia',
				franchisors : franchisors
			});
		});
	});

	app.post('/franchises/create', CheckAuth.user, function(req, res){
		var franchise = new FranchiseModel(req.body.franchise);
		franchise.save(function(err){
			if (err) throw err;
			res.redirect('/franchisors');
		});

	});

	app.get('/franchises/edit/:id', CheckAuth.user, function(req, res){
		FranchisorModel.find({}, function(err, franchisors){
			FranchiseModel.findById(req.params.id, function(err, franchise){
				if (err) throw err;
				if(franchise){
					res.render('franchises/edit', {
						title 		: 'Editar franquiciante',
						franchise 	: franchise
					});
				}else{
					res.redirect('/franchisors');
				}
			});
		});
	});

	app.post('/franchises/edit', CheckAuth.user, function(req, res){
		FranchiseModel.findById(req.body.franchise_id, function(err, franchise){
			if (err) throw err;
			if(franchise){
				franchise.name = req.body.franchise.name
				franchise.slug = req.body.franchise.slug
				franchise.timezone =req.body.franchise.timezone
				franchise.is_default =req.body.franchise.is_default
				franchise.modified = new Date();
				franchise.save(function(err){
					if (err) throw err;
					res.redirect('/franchises/'+franchise.franchisor);
				});
			}
		})

	});

	app.post('/franchises', function(req, res, next){
		if(typeof req.session.user !== "undefined"){
			if(typeof req.session.user.franchisor !== "undefined"){
				if(req.session.user.franchisor.length>0){
					franchisor = req.session.user.franchisor[0]._id
					FranchiseModel.find({'franchisor':franchisor}).sort("-name").exec( function(err, franchises){
						if (err) throw err;
						res.json(franchises);
					});
				}
			}
		}
	});


	app.get('/franchises/select/:franchise_id', function(req, res, next){
		FranchiseModel.findById(req.params.franchise_id, function(err, franchise){
			if (err) throw err;
			req.session.selected_franchise = franchise;
			res.redirect('/');
		});
	});

	app.get('/franchises/:id', function(req, res, next){
		FranchiseModel.find({"franchisor":req.params.id}).sort("-name").exec( function(err, franchises){
			if (err) throw err;
			res.render('franchises/list', {
				title 		: 'Lista de franquicias',
				franchises 	: franchises
			});
		});
	});
	
	app.get('/franchises/json/:id', function(req, res, next){
		FranchiseModel.find({ franchisor : req.params.id}).sort("-name").exec( function(err, franchises){
			if (err) throw err;
			res.json(franchises);
		});
	});
}