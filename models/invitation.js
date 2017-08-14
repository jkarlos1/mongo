// Creación de la Conexión
var mongoose = require('mongoose');

var InvitationSchema = exports.InvitationSchema = new mongoose.Schema({
	name				: { type: String, required: true},
	email				: { type: String, required: true},
	subject	   			: { type: String, required: true },
	body        		: { type: String, required: true },
	accepted_date  		:   Date,
	declined_date  		:   Date,
	invitation_type		: { type: String },
	invite_user			: { type: mongoose.Schema.ObjectId, ref: 'User' },
	created    		    :  {type: Date, default: Date.now },	
	modified			:  {type: Date, default: Date.now }	
})

exports.InvitationModel = mongoose.model('Invitation', exports.InvitationSchema);


