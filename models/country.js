// Creación de la Conexión
var mongoose = require('mongoose');
var StateSchema = require('./state').StateSchema;

var CountrySchema = new mongoose.Schema({
	name				: { type: String, required:true, trim:true},
	created        		: { type: Date, default: Date.now },
	modified       		: { type: Date, default: Date.now }
});

exports.CountryModel = mongoose.model('Country', CountrySchema);
