// Creación de la Conexión
var mongoose = require('mongoose');

var NewSchema = new mongoose.Schema({
	from_user  	: { type: mongoose.Schema.ObjectId, ref: 'User' },
	to_user  	: { type: mongoose.Schema.ObjectId, ref: 'User' },
	deal  		: { type: mongoose.Schema.ObjectId, ref: 'Deal' },
	commission	: { type: mongoose.Schema.ObjectId, ref: 'Commission' },
	event  		: { type: mongoose.Schema.ObjectId, ref: 'Event' },
	created    	:  {type: Date, default: Date.now },
	informed	: {type: Boolean, default: false},
	modified    :   Date
})

exports.NewModel = mongoose.model('New', NewSchema);