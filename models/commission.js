// Creación de la Conexión
var mongoose = require('mongoose');

var CommissionSchema = new mongoose.Schema({
	user   			: { type: mongoose.Schema.ObjectId, ref: 'User' }, 
	//Usuario receptor de la comission, si es store refiere al usuario partner en ese momento
	sale				: { type: mongoose.Schema.ObjectId, ref: 'Sale' },
	amount				: { type: Number, required: true, min:0},
	currency	   		: [{ type: mongoose.Schema.ObjectId, ref: 'Currency' }],
	paid_date			: { type: Date },
	created  		    : {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
})

exports.CommissionModel = mongoose.model('Commission', CommissionSchema);