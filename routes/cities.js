var CityModel = require('../models/city').CityModel;
var StateModel = require('../models/state').StateModel;


module.exports = function(app){

	app.get('/cities/:id:format(.json)?', function(req, res, next){
		CityModel.find({ state : req.params.id }).sort("-name").exec(  function(err, cities){
			if (err) throw err;

			res.json(cities);
		});
	});

	app.get('/cities/create/:state_id', function(req, res){

		StateModel.findById(req.params.state_id, function(err, state){
			if (err) throw err;
			if (state){
				res.render('cities/create', {
					title 		: 'Crear ciudad',
					state 		: state
				});
			}else{
				res.redirect('states/edit/' + state._id);
			}
		});

	});


	app.post('/cities/create', function(req, res){
		var city = new CityModel(req.body.city);
		city.save(function(err){
			if (err) throw err;
			req.session.message = 'Ciudad creada correctamente';
			res.redirect('states/edit/' + city.state);
		});
	});

	app.post('/cities/edit/:id', function(req, res){
		StateModel.findById(req.params.id, function(err, state){
			if (err) throw err;

			if(state){
				CityModel.find({ state : state._id }, function(err, cities){
					if (err) throw err;
					res.render('cities/edit', {
						title 		: 'Editar Estado / Provincia',
						state 		: state,
						cities 		: cities
					});
				});
			}else{
				res.redirect('/states/list');
			}
		});
	});
}