var LevelModel = require('../models/level').LevelModel;

module.exports = function(app){
	app.get('/levels/initialize', function(req, res){
		LevelModel.remove().exec(function(err,levels){
			console.log(levels.length)

			LevelModel.find().exec(function(err,levels){
				console.log(levels.length)
			})
			LevelModel.remove({});
			var levels = new LevelModel();
			levels.name = 'Cristal'
			levels.number = 1
			levels.bonus = 0.1
			levels.description = "Primer nivel de usuario"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			}); 

			var levels = new LevelModel();
			levels.name = 'Plata'
			levels.number = 2
			levels.bonus = 0.2
			levels.description = "Segundo nivel de usuario, contactos entre 10 y 20"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});   

			var levels = new LevelModel();
			levels.name = 'Perla'
			levels.number = 3
			levels.bonus = 0.3
			levels.description = "Tercer nivel de usuario, contactos entre 20 y 30"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});   

			var levels = new LevelModel();
			levels.name = 'Jade'
			levels.number = 4
			levels.bonus = 0.4
			levels.description = "Cuarto nivel de usuario, contactos entre 30 y 40"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});   

			var levels = new LevelModel();
			levels.name = 'Ruby'
			levels.number = 5
			levels.bonus = 0.5
			levels.description = "Quinto nivel de usuario, contactos entre 40 y 50"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});    

			var levels = new LevelModel();
			levels.name = 'Zafiro'
			levels.number = 6
			levels.bonus = 0.6
			levels.description = "Sexto nivel de usuario, contactos entre 50 y 60"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});   

			var levels = new LevelModel();
			levels.name = 'Oro'
			levels.number = 7
			levels.bonus = 0.7
			levels.description = "Séptimo nivel de usuario, contactos entre 60 y 70"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});   

			var levels = new LevelModel();
			levels.name = 'Esmeralda'
			levels.number = 8
			levels.bonus = 0.8
			levels.description = "Octavo nivel de usuario, contactos entre 70 y 80"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});   

			var levels = new LevelModel();
			levels.name = 'Diamante'
			levels.number = 9
			levels.bonus = 0.9
			levels.description = "Noveno nivel de usuario, contactos entre 80 y 90"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});   

			var levels = new LevelModel();
			levels.name = 'Platino'
			levels.number = 10
			levels.bonus = 1
			levels.description = "Décimo y último nivel de usuario, mas de 90 contactos"
			levels.save(function(err){
				if(!err){
					console.log(levels);
				} else {
					console.log("Error: - " + err);
				}
			});
			LevelModel.find().exec(function(err,levels){
				console.log(levels.length)
			})
		})
});
	app.get('/levels', function(req, res, next){
		LevelModel.find({}).exec( function(err, levels){
			if (err) throw err;
			res.json(levels);
		});
	});
}