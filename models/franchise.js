var mongoose = require('mongoose');

var FranchiseSchema = new mongoose.Schema({
	name				: { type: String ,trim:true},
	slug				: { type: String , unique:true},
	is_default			: { type: Boolean },
	timezone			: { type: Number},
	franchisor			: { type: mongoose.Schema.ObjectId, ref: 'Franchisor' },
	created    		    : {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }	
});	

exports.FranchiseModel = mongoose.model('Franchise', FranchiseSchema);