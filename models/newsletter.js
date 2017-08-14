// Creación de la Conexión
var mongoose = require('mongoose');


var NewsletterSchema = new mongoose.Schema({
	franchise			: { type: mongoose.Schema.ObjectId, ref: 'Franchise' },
	deals 				: [{ type: mongoose.Schema.ObjectId, ref: 'Deal' }],
	title				: { type: String, required: true},
	description			: { type: String, required: true},
	created    		    :  {type: Date, default: Date.now }
})

exports.NewsletterModel = mongoose.model('Newsletter', NewsletterSchema);