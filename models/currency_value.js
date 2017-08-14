var mongoose = require('mongoose');

CurrencyValueSchema = exports.CurrencyValueSchema = new mongoose.Schema({
	value				: { type: Number, required: true},
	initial_date		: { type: Date, required: true, default: Date.now},
	final_date			: { type: Date}
});

exports.CurrencyValueModel = mongoose.model('CurrencyValue', CurrencyValueSchema);