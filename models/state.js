// Creación de la Conexión
var mongoose = require('mongoose');

var CitySchema = require('./city').CitySchema;

var StateSchema  = StateSchema = new mongoose.Schema({
	name				: { type: String, required: true},
	country      		: { type: mongoose.Schema.ObjectId, ref: 'Country' },
	created        		: { type: Date, default: Date.now },
	modified       		: { type: Date, default: Date.now }	
})

exports.StateModel = mongoose.model('State', StateSchema);