// Creación de la Conexión
var mongoose = require('mongoose');

var CurrencyValueSchema = require('./currency_value').CurrencyValueSchema;

var CurrencySchema = exports.CurrencySchema = new mongoose.Schema({
	name				: { type: String, required: true},
	iso					: { type: String,unique:true, required: true},
	symbol				: { type: String, required: true},
	currency_values		: [CurrencyValueSchema]
});

exports.CurrencyModel = mongoose.model('Currency', CurrencySchema);