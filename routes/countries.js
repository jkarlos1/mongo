var CountryModel = require('../models/country').CountryModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;
var CheckAuth = require('../middleware/checkAuth');
var _ = require('underscore');
module.exports = function(app){




	//Este regex nos permite pedir la misma funcion como json, para usar donde necesitamos elegir quien nos invito y similar.
	app.get('/countries.json', function(req, res, next){
		CountryModel.find().sort("-name").exec( function(err, country){
			if (err) throw err;
			if(req.params.format){
				usernames = [];
				for (var i = countries.length - 1; i >= 0; i--) {
					countries.push(countries[i].name)
				};
				res.send(usernames)
			}
		});
	});


	app.get('/countries/list', CheckAuth.user, function(req, res){

		CountryModel.find({}, function(err, countries){
			if (err) throw err;

			res.render('countries/list', {
				title 		: 'Lista de paises',
				countries 	: countries
			});

		});

	});


	app.get('/countries/create', CheckAuth.user, function(req, res){
		res.render('countries/create', {
			title 		: 'Cargar pais'
		});
	});

	app.post('/countries/create', CheckAuth.user, function(req, res){
		var country = new CountryModel(req.body.country);
		country.save(function(err){
			if (err) throw err;
			res.redirect('/countries');
		});

	});

	app.get('/countries/edit/:id', CheckAuth.user, function(req, res){
		CountryModel.findById(req.params.id, function(err, country){
			if (err) throw err;
			if(country){
				StateModel.find({ country : country._id }, function(err, states){
					res.render('countries/edit', {
						title 		: 'Editar pais',
						country 	: country,
						states 		: states
					});
				});
			}else{
				res.redirect('/countries/list');
			}
		});
	});

	app.post('/countries/edit', CheckAuth.user, function(req, res){
		CountryModel.findById(req.body.country_id, function(err, country){
			if (err) throw err;
			if(country){
				country.name = req.body.country.name;
				country.modified = new Date();
				country.save(function(err){
					if (err) throw err;
					res.redirect('/countries/list');
				});
			}
		})

	});


	app.get('/countries/initialize', function(req, res){
		CurrencyModel.findOne().exec(function(err,currency){
			CountryModel.remove().exec(function(err,country){
				console.log(country.length)

				CountryModel.find().exec(function(err,country){
					console.log(country.length)
				})
				CountryModel.remove({});
				var country = new CountryModel();
				country.name = 'Argentina'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Argentina"}).exec(function(err,country){
						var state = new StateModel();
						state.name = 'Entre Rios'
						state.country = country._id
						state.save(function(err, state){
							if(!err){

								console.log(state);

								var city = new CityModel({
									name 	: 'Parana',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

							} else {

							}
						});
						var state = new StateModel();
						state.name = 'Santa Fe'
						state.country = country._id
						state.save(function(err, state){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Rosario',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

								var city = new CityModel({
									name 	: 'Santa Fe',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});


							} else {
								console.log("Error: - " + err);
							}
						});
						var state = new StateModel();
						state.name = 'Buenos Aires'
						state.country = country._id
						state.save(function(err, state){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Buenos Aires',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

								var city = new CityModel({
									name 	: 'Pergamino',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

								var city = new CityModel({
									name 	: 'La Plata',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});


							} else {
								console.log("Error: - " + err);
							}
						});
						var state = new StateModel();
						state.name = 'Cordoba'
						state.country = country._id
						state.save(function(err, state){
							if(!err){
								console.log(state);


								var city = new CityModel({
									name 	: 'Cordoba',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

							} else {
								console.log("Error: - " + err);
							}
						});
						var state = new StateModel();
						state.name = 'Mendoza'
						state.country = country._id
						state.save(function(err, state){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Mendoza',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

							} else {
								console.log("Error: - " + err);
							}
						});
						var state = new StateModel();
						state.name = 'Corrientes'
						state.country = country._id
						state.save(function(err, state){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Corrientes',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

							} else {
								console.log("Error: - " + err);
							}
						});
					})
					} else {
						console.log("Error: - " + err);
					}
				});

				var country = new CountryModel();
				country.name = 'Mexico'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Mexico"}).exec(function(err,country){
							var state = new StateModel();
							state.name = 'Df'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
							var state = new StateModel();
							state.name = 'Guadalajara'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
							var state = new StateModel();
							state.name = 'Morelia'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
							var state = new StateModel();
							state.name = 'Acapulco'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
						})
					} else {
						console.log("Error: - " + err);
					}
				});
				var country = new CountryModel();
				country.name = 'Puerto Rico'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Puerto Rico"}).exec(function(err,country){
							var state = new StateModel();
							state.name = 'San Jose'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
						})
					} else {
						console.log("Error: - " + err);
					}
				});

			})
			CountryModel.findOne({"name":"Argentina"}).exec(function(){

			})
			res.send("OK")
	})
});
}
