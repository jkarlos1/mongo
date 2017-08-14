// Creación de la Conexión
var mongoose = require('mongoose');

var CouponSchema = require('./coupon').CouponSchema;

var SaleSchema =  exports.SaleSchema = new mongoose.Schema({
	user	   			: { type: mongoose.Schema.ObjectId, ref: 'User' },
	payment_method		: { type: String },
	status				: { type: String },
	branch				: {  type: mongoose.Schema.ObjectId, ref: 'Branch' },
	coupons      		: [CouponSchema],
	created    		 	: {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
});

exports.SaleModel = mongoose.model('Sale', SaleSchema);
