// Creación de la Conexión
var mongoose = require('mongoose');

var CommissionSchema = require('./commission').CommissionSchema;
var BranchSchema = require('./branch').BranchSchema;
var ImageSchema = require('./image').ImageSchema;

var StoreSchema = new mongoose.Schema({
	name				: { type: String , trim:true},
	about				: { type: String },
	email				: { type: String },
	creator	   			: { type: mongoose.Schema.ObjectId, ref: 'User' }, //deberia ser un seller
	franchisor			: { type: mongoose.Schema.ObjectId, ref: 'Franchisor' },
	images 				: [{ type: mongoose.Schema.ObjectId, ref: 'Image' }],
	branches			: [BranchSchema],
	created    			: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now },
	status				: {type: String, enum: ['active', 'deleted'], default: 'active'}
});
StoreSchema.set('versionKey', false);
exports.StoreModel = mongoose.model('Store', StoreSchema);
