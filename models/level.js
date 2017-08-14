// Creación de la Conexión
var mongoose = require('mongoose');

var LevelSchema =  new mongoose.Schema({
	number				: { type: Number, required: true },
	name    			: { type: String, required: true , trim:true},
	bonus				: { type: Number, required: true, min:0},
	description	   		: { type: String },
	created    		    :  {type: Date, default: Date.now },
	modified        	:  {type: Date, default: Date.now }
})

exports.LevelModel = mongoose.model('Level', LevelSchema);

exports.MAX_LEVEL = 10;

exports.MIN_LEVEL = 1;