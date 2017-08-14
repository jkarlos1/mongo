
var mongoose = require('mongoose');

BranchSchema = exports.BranchSchema = new mongoose.Schema({
	default				: { type: Boolean, default: false },
	name				: { type: String , required:true},
	address				: { type: String },
	lat					: { type: Number},
	ltg					: { type: Number},
	zip					: { type: String },
	phone				: { type: String },
	email				: { type: String },
	website				: { type: String },
	fanpage				: { type: String },
	twitter				: { type: String },
	contact				: { type: String },
	partner	   			: { type: mongoose.Schema.ObjectId, ref: 'User' },
	franchise 			: { type: mongoose.Schema.ObjectId, ref: 'Franchise'},
	city 				: { type: mongoose.Schema.ObjectId, ref: 'City'},
	created    			: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }	
});

exports.BranchModel = mongoose.model('Branch', BranchSchema);