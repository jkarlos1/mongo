var FranchisorModel = require('../models/franchisor').FranchisorModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var CountryModel = require('../models/country').CountryModel;
var mongoose = require('mongoose');
var CheckAuth = require('../middleware/checkAuth');
var Encrypter = require('../helpers/encryption');
module.exports = function(app){


	app.get('/franchisors/initialize', function(req, res){

		CurrencyModel.findOne().exec(function(err,currency){

			FranchisorModel.remove().exec(function(err,franchisor){

				CountryModel.findOne({ name : 'Argentina'}, function(err, country){
					
					var franchisor = new FranchisorModel();
					
					franchisor.name = 'Argentina';
					franchisor.cctdl = "ar";
					franchisor.default_timezone = -3;
					franchisor.currency =currency._id;
					franchisor.country = country._id;

					franchisor.save(function(err){
						if(!err){
							console.log(franchisor);
						} else {
							console.log("Error: - " + err);
						}
					}); 

				});

				CountryModel.findOne({ name : 'Mexico'}, function(err, country){
					
					var franchisor = new FranchisorModel();
					franchisor.name = 'Mexico';
					franchisor.cctdl = "mx";
					franchisor.default_timezone = -6;
					franchisor.country = country._id;

					franchisor.save(function(err){
						if(!err){
							console.log(franchisor);
						} else {
							console.log("Error: - " + err);
						}
					}); 
				});

				CountryModel.findOne({ name : 'Puerto Rico'}, function(err, country){
					
					var franchisor = new FranchisorModel();

					franchisor.name = 'Puerto Rico';
					franchisor.cctdl = "pr";
					franchisor.default_timezone = -4;
					franchisor.country = country._id;

					franchisor.save(function(err){
						if(!err){
							console.log(franchisor);
						} else {
							console.log("Error: - " + err);
						}
					}); 
				});
			})
		});
	});

	app.get('/franchisors/create', CheckAuth.user, function(req, res){
		res.render('franchisors/create', {
			title 		: 'Cargar franquiciante'
		});
	});

	app.post('/franchisors/create', CheckAuth.user, function(req, res){
		var franchisor = new FranchisorModel(req.body.franchisor);
		franchisor.save(function(err){
			if (err) throw err;
			res.redirect('/franchisors');
		});

	});

	app.get('/franchisors/edit/:id', CheckAuth.user, function(req, res){
		FranchisorModel.findById(req.params.id, function(err, franchisor){
			if (err) throw err;
			if(franchisor){
				res.render('franchisors/edit', {
					title 		: 'Editar franquiciante',
					franchisor 	: franchisor
				});
			}else{
				res.redirect('/franchisors');
			}
		});
	});

	app.post('/franchisors/edit', CheckAuth.user, function(req, res){
		FranchisorModel.findById(req.body.franchisor_id, function(err, franchisor){
			if (err) throw err;
			if(franchisor){
				franchisor.name = req.body.franchisor.name;
				franchisor.modified = new Date();
				franchisor.save(function(err){
					if (err) throw err;
					res.redirect('/franchisors');
				});
			}
		})

	});
	app.get('/franchisors', function(req, res, next){
		FranchisorModel.find().sort("-name").exec( function(err, franchisors){
			if (err) throw err;
			res.render('franchisors/list', {
				title 		: 'Lista de franquiciantes',
				franchisors 	: franchisors
			});
		});
	});
	app.get('/franchisors/json/:id', function(req, res, next){
		FranchisorModel.find({ country : req.params.id}).sort("-name").exec( function(err, franchisors){
			if (err) throw err;
			res.json(franchisors);
		});
	});

	


}