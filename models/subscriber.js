// Creación de la Conexión
var mongoose = require('mongoose');

//Podria estar embebido en la franquicia
var SubscriberSchema = new mongoose.Schema({
	name				: { type: String, required: true, trim:true},
	email				: { type: String, required: true},
	franchise			: { type: mongoose.Schema.ObjectId, ref: 'Franchise'},
	created				: { type: Date,  default: Date.now },
	modified			: { type: Date,  default: Date.now }
})

exports.SubscriberModel = mongoose.model('Subscriber', SubscriberSchema);
