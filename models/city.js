// Creación de la Conexión
var mongoose = require('mongoose');

var CitySchema = new mongoose.Schema({
	name		:{ type: String, required: true},
	state      	:{ type: mongoose.Schema.ObjectId, ref: 'State' },
	created     :{ type: Date, default: Date.now },
	modified    :{ type: Date, default: Date.now }
})

exports.CityModel = mongoose.model('City', CitySchema);