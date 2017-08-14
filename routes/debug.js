

//Este controlador contiene metodos exclusivos de prueba
//ninguno de estos metodos tiene referencia en las reglas de negocio y no deberian encontrarse
//en la version de produccion.

var UserModel = require('../models/user').UserModel;
var FranchisorModel = require('../models/franchisor').FranchisorModel;


module.exports = function(app){


	app.get('/debug/add_franchisor_to_user/:id', function(req, res, next){
		UserModel.findById(req.params.id, function(err, user){
			if (err) throw err;

			FranchisorModel.findOne({ name : 'Argentina'}, function(err, franchisor){

				if(user.franchisor.indexOf(franchisor._id) == -1){
					user.franchisor.push(franchisor._id);
				}

				user.save(function(err){
					if (err) throw err;

					res.redirect('/debug/my_user');
				})
			});
		});
	});

	app.get('/debug/my_user', function(req, res, next){
		res.send(req.session.user);
	});


	app.get('/debug/autologin', function(req, res, next){

		UserModel.findOne({ username : 'bengui'}, function(err, user){
			if (err) throw err;
			req.session.user = user;
			res.redirect('/');
		});

	});

}