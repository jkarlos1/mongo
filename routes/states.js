var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;
var CountryModel = require('../models/country').CountryModel;

module.exports = function(app){

	app.get('/states/:id:format(.json)?', function(req, res, next){
		StateModel.find({ country : req.params.id}).sort("-name").exec( function(err, states){
			if (err) throw err;
			res.json(states);
		});
	});

	app.get('/states/create/:country_id', function(req, res){

		CountryModel.findById( req.params.country_id, function(err, country){
			if (err) throw err;

			if(country){
				res.render('states/create', {
						title 		: 'Crear Provincia',
						country		: country
						});
			}else{
				res.redirect('/countries/list');
			}
		});
	});


	app.post('/states/create', function(req, res){

		var state = new StateModel(req.body.state);
		state.save(function(err){
			if(err) throw err;

			req.session.message = 'Pais / Estado creado correctamente';

			res.redirect('/countries/edit/' + state.country);
			
		});

	});


	app.get('/states/cities/:id:format(.json)?', function(req, res, next){
		CityModel.find({ state : req.params.id })
		.sort('-name')
		.exec(function(err, cities){
			if (err) throw err;
			res.json(cities);
		});
	});

	app.get('/states/edit/:id', function(req, res){
		StateModel.findById(req.params.id, function(err, state){
			if (err) throw err;

			if(state){
				CityModel.find({ state : state._id }, function(err, cities){
					if (err) throw err;
					res.render('states/edit', {
						title 		: 'Editar Estado / Provincia',
						state 		: state,
						cities 		: cities
					});
				});
			}else{
				res.redirect('/countries/list');
			}
		});
	});

}
