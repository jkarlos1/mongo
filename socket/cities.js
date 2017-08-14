var util = require('../helpers/util');
var CityModel = require('../models/city').CityModel;
var mongoose = require('mongoose');

module.exports = function(socket, session, io){

	socket.on('cities.get', function(){
		CityModel.find({}, function(err, cities){
			if (err) throw err;
			socket.emit('cities.get', cities);
		});
	});

}