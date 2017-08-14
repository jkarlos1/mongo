// Creación de la Conexión
var mongoose = require('mongoose');

var ImageSchema = require('./image').ImageSchema;
var SaleSchema = require('./sale').SaleSchema;

var DealSchema = new mongoose.Schema({
	title				: { type: String, required: true },
	tagline				: [{ type: String }],
	slug				: { type: String, trim:true },
	characteristics		: { type: String, required: true },
	conditions			: { type: String, required: true },
	price				: { type: Number, required: true },
	special_price		: { type: Number, required: true },
	discount			: { type: Number, min:0, max:99 },
	start_date        	: { type: Date, required: true },
	end_date        	: { type: Date, required: true },
	start_redeem        : { type: Date, required: true },
	end_redeem        	: { type: Date, required: true },
	max_coupons			: { type: Number, required: true, min:0},
	max_coupons_by_user	: { type: Number, required: true, min:0},
	seller_percentage	: { type: Number, required: true, min:0, max:99 },
	giombu_percentage	: { type: Number, required: true, min:0, max:99 },
	promoter_percentage	: { type: Number, required: true, min:0, max:99 },
	status				: { type: String },
	shipping_cost		: { type: Number, default: 0},
	branches   			: [{ type: mongoose.Schema.ObjectId, ref: 'Branch' }],
	seller   			: { type: mongoose.Schema.ObjectId, ref: 'User' },
	franchises  		: [{ type: mongoose.Schema.ObjectId, ref: 'Franchise' }],
	store				: { type: mongoose.Schema.ObjectId, ref: 'Store' },
	currency	   		: { type: mongoose.Schema.ObjectId, ref: 'Currency' },
	//Peso para ordenarlas
	weight				: { type: Number, default: 10 },
	//Compras realizadas
	sales				: [SaleSchema],
	//Imagenes
	images 				: [{ type: mongoose.Schema.ObjectId, ref: 'Image' }],
	created    		    : { type: Date, default: Date.now },
	modified        	: { type: Date, default: Date.now }
})
DealSchema.set('versionKey', false);
exports.DealModel = mongoose.model('Deal', DealSchema);


exports.DealStatus = (function(){
	var draft = 'draft';
	var active = 'active';
	var closed = 'closed';

	return{
		list 	 	: function(){
			return [draft, active, closed];
		},
		getDraft 	: function(){
			return draft;
		},
		getActive 	: function(){
			return active;
		},
		getClosed 	: function(){
			return closed;
		}
	}
})();
