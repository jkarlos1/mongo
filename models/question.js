// Creación de la Conexión
var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
	deal  			: { type: mongoose.Schema.ObjectId, ref: 'Deal' },
	user  			: { type: mongoose.Schema.ObjectId, ref: 'User' },
	partner 		: { type: mongoose.Schema.ObjectId, ref: 'User' },
	question 		: { type: String },
	answer			: { type: String },
	answer_admin	: { type: String },
	created	    	: { type: Date, default: Date.now },
    modified        : { type: Date, default: Date.now }
})

exports.QuestionModel = mongoose.model('Question', QuestionSchema);
