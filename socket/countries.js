var util = require('../helpers/util');
var CountryModel = require('../models/country').CountryModel;
var FranchisorModel = require('../models/franchisor').FranchisorModel;
var FranchiseModel = require('../models/franchise').FranchiseModel;
var mongoose = require('mongoose');

module.exports = function(socket, session, io){

	socket.on('countries.get', function(){
		CountryModel.find({}, function(err, countries){
			if (err) throw err;
			socket.emit('countries.get', countries);
		});
	});


	socket.on('countries.get_franchises', function(country_id){
		var country = mongoose.Types.ObjectId(country_id);
		FranchisorModel.aggregate()
		.match({ country :  country })
		.group({ _id : '$country', franchisors_ids : { $push : '$_id'}})
		.exec(function(err, documents){
			if( documents.length){
				var franchisors_ids = documents[0].franchisors_ids;
				FranchiseModel.find({franchisor : { $in : franchisors_ids }}, function(err, franchises){
					if (err) throw err;
					socket.emit('countries.get_franchises', franchises);
				});
			}
		});

	});

}