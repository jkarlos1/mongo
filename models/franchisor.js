// Creación de la Conexión
var mongoose = require('mongoose');

var FranchisorSchema =  new mongoose.Schema({
	name				: { type: String , trim:true },
	default_domain		: { type: String , trim:true},
	secure_domain		: { type: String , trim:true},
	cctdl				: { type: String , trim:true},
	email				: { type: String , trim:true},
	smtp				: { type: String , trim:true},
	default_timezone	: { type: Number },
	language			: { type: String },
	fanpage				: { type: String , trim:true},
	country	   			: { type: mongoose.Schema.ObjectId, ref: 'Country' },	
	currency   			: { type: mongoose.Schema.ObjectId, ref: 'Currency' },
	created    		    :  {type: Date, default: Date.now },
	modified			:  {type: Date, default: Date.now }
});

exports.FranchisorModel = mongoose.model('Franchisor', FranchisorSchema);