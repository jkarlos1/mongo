// Creación de la Conexión
var mongoose = require('mongoose');

var BonusSchema = new mongoose.Schema({
	amount				: { type: Number,  min: 0},
	paid_date			: { type: Date},
	user				: { type: mongoose.Schema.ObjectId, ref: 'User'},
	promoter			: { type: mongoose.Schema.ObjectId, ref: 'User'},
	currency			: { type: mongoose.Schema.ObjectId, ref: 'Currency'},
	created				: { type: Date, default:Date.now },
	modified			: { type: Date}
});
exports.BonusModel = mongoose.model('Bonus', BonusSchema);