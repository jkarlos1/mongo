
var mongoose = require('mongoose');

var CouponSchema = exports.CouponSchema = new mongoose.Schema({
	code				: { type: String ,trim:true, required:true},
	status   			: { type: String, default: "unredeemed" },
	created			    : { type: Date, required: true, default: Date.now },
    modified            : { type: Date, required: true, default: Date.now }	
})
//Este schema va embebido dentro de sales por eso no tiene declarada la venta.
exports.CouponModel = mongoose.model('Coupon', CouponSchema);