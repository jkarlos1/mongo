// Creación de la Conexión
var mongoose = require('mongoose');

var PromoterSchema = exports.PromoterSchema = new mongoose.Schema({
	confirm_promoter_token	: { type: String},
	page_title				: { type: String, required: true},
	page_body				: { type: String, required: true},
	subscribers_invite		: { type: String, required: true},
	parent_id 				: { type: mongoose.Schema.ObjectId, ref: 'User' },
	created    		 	    : {type: Date, default: Date.now },
	modified				: {type: Date, default: Date.now }
})
PromoterSchema.set('versionKey', false);
exports.PromoterModel = mongoose.model('Promoter', PromoterSchema);
