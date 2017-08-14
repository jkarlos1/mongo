
var mongoose = require('mongoose');

var BankAccountSchema = new mongoose.Schema({
	bank_name			: { type: String, trim: true},
	bank_clabe			: { type: String, trim: true},
	bank_rute			: { type: String, trim: true},
	bank_number			: { type: String, trim: true},
	curp				: { type: String, trim: true},
	ife 				: { type: String, trim: true},
	user				: { type: mongoose.Schema.ObjectId, ref: 'User' },
	created    		    : {type: Date, default: Date.now },
	modified			: Date
});

exports.BankAccountModel = mongoose.model('BankAccount', BankAccountSchema);